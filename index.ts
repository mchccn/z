const exclude = <O extends object>(object: O, keys: (keyof O)[]) => Object.fromEntries(Object.entries(object).filter(([k]) => !keys.includes(k as keyof O)));

class Snapshot<S extends object> {
    #id: string;
    #snapshot: S;
    #message: string;

    constructor(snapshot: S, message?: string) {
        if (typeof snapshot !== "object" || snapshot === null) throw new Error("The snapshot must be an object");

        if (typeof message !== "undefined") {
            if (typeof message !== "string") throw new Error("Commit message must be a string.");

            if (message.length > 65536) throw new Error("Commit message cannot be over 65536 characters.");
        }

        //@ts-ignore
        this.#id = (
            Date.now().toString(16) +
            [...(typeof message === "string" ? message : "")].reduce((a, b) => a + b.charCodeAt(0), 0).toString(16) +
            Math.floor(Math.random() * 4294967296).toString(16)
        ).padEnd(64, "0");

        this.#snapshot = snapshot;

        this.#message = typeof message === "string" ? message : "";
    }

    get id() {
        return this.#id;
    }

    get snapshot() {
        return this.#snapshot;
    }

    get message() {
        return this.#message;
    }
}

class Branch {
    #name: string;
    #snapshots: Snapshot<any>[];

    constructor(name: string, snapshot?: Snapshot<any>, message?: string) {
        this.#name = name;
        this.#snapshots = typeof snapshot === "object" ? [new Snapshot(Object.assign({}, snapshot), message)] : [];
    }

    commit(snapshot: Snapshot<any>, message?: string) {
        this.#snapshots.push(new Snapshot(Object.assign({}, snapshot), message));

        return this;
    }

    revert(id?: string) {
        if (this.#snapshots.length <= 1) throw new Error("Already at earliest change.");

        if (typeof id === "string") {
            const index = this.#snapshots.findIndex((s) => s.id === id);

            if (index < 0) throw new Error("Cannot revert because there is no snapshot with that id.");

            this.#snapshots = this.#snapshots.slice(0, index);
        } else this.#snapshots.pop();

        return this.latest;
    }

    get name() {
        return this.#name;
    }

    find(id: string) {
        return this.#snapshots.find((s) => s.id === id);
    }

    get latest() {
        return this.#snapshots[this.#snapshots.length - 1];
    }
}

class History {
    #branches = new Map();
    #current;

    constructor(snapshot: Snapshot<any>, opts?: { master?: string; message?: string }) {
        let master = "master";

        if (typeof opts === "object" && opts) {
            if (typeof opts.master === "string" && opts.master) master = opts.master;
        }

        this.#branches.set(master, new Branch(master, snapshot, opts && opts.message));

        this.#current = this.#branches.get(master).latest.id;
    }

    get current() {
        return this.#current;
    }

    get currentSnapshot() {
        return this.find(this.#current)!.snapshot;
    }

    checkout(name: string) {
        if (!this.#branches.has(name)) throw new Error("Branch doesn't exist.");

        this.#current = this.#branches.get(name).latest.id;

        return this;
    }

    branch(name: string, snapshot: Snapshot<any>, opts?: { m: boolean; b: boolean }) {
        if (this.#branches.has(name) && !(opts && opts.m)) throw new Error("Branch already exists.");

        const branch = new Branch(name, snapshot);

        this.#branches.set(name, branch);

        if (opts && opts.b) this.#current = branch.latest.id;

        return this;
    }

    commit(snapshot: Snapshot<any>, message?: string) {
        const { branch } = this.find(this.#current)!;

        branch.commit(snapshot, message);

        this.#current = branch.latest.id;

        return this;
    }

    revert(id: string) {
        const { branch } = this.find(this.#current)!;

        const snapshot = branch.revert(id);

        this.#current = snapshot.id;

        return snapshot;
    }

    find(id: string) {
        for (const branch of [...this.#branches.values()]) {
            const snapshot = branch.find(id);

            if (snapshot)
                return {
                    branch,
                    snapshot,
                };
        }

        return;
    }
}

export default class Zed<T extends object> {
    #object?: object;
    #history: History;

    //@ts-ignore
    static #Simple = class Simple<T extends object> {
        #object?: object;
        #snapshots: object[];

        constructor(object?: T) {
            if (this.constructor === Simple) {
                if (!object) throw new Error("Cannot instantiate an instance of Zed.Simple without an object.");

                if (typeof object !== "object" || object === null) throw new Error("Zed.Simple requires an object to track.");

                this.#object = object;

                this.#snapshots = [Object.assign({}, this.#object)];
            } else {
                this.#snapshots = [Object.assign({}, exclude(this, ["latest", "commit", "revert"]))];
            }
        }

        get latest() {
            if (this.constructor === Simple) return this.#object;

            return this;
        }

        commit() {
            if (this.constructor === Simple) this.#snapshots.push(Object.assign({}, this.#object));
            else this.#snapshots.push(Object.assign({}, exclude(this, ["latest", "commit", "revert"])));

            return this;
        }

        revert(times?: number, force?: boolean) {
            if (typeof times === "number") {
                if (times > this.#snapshots.length - 1 && !force) throw new Error("Can't revert that many times.");

                this.#snapshots = this.#snapshots.slice(0, Math.max(1, this.#snapshots.length - times));
            } else this.#snapshots.pop();

            if (this.constructor === Simple) this.#object = this.#snapshots[this.#snapshots.length - 1];
            else
                Object.entries(this.#snapshots[this.#snapshots.length - 1]).forEach(([k, v]) => {
                    //@ts-ignore
                    this[k] = v;
                });

            return this;
        }
    };

    constructor(
        object: T | any,
        opts?: {
            master?: string | undefined;
            message?: string | undefined;
        }
    ) {
        if (this.constructor === Zed) {
            if (!object) throw new Error("Cannot instantiate an instance of Zed without an object.");

            if (typeof object !== "object" || object === null) throw new Error("Zed requires an object to track.");

            this.#object = object;

            this.#history = new History(object, opts);
        } else {
            //@ts-ignore
            this.#history = new History(Object.assign({}, exclude(this, ["latest", "commit", "revert"])), object);
        }
    }

    get latest() {
        if (this.constructor === Zed) return this.#object;

        return this;
    }

    checkout(name: string) {
        this.#history.checkout(name);

        if (this.constructor === Zed) this.#object = this.#history.currentSnapshot.snapshot;
        else
            Object.entries(this.#history.currentSnapshot.snapshot).forEach(([k, v]) => {
                //@ts-ignore
                this[k] = v;
            });

        return this;
    }

    branch(
        name: string,
        opts?: {
            m: boolean;
            b: boolean;
        }
    ) {
        if (this.constructor === Zed) {
            //@ts-ignore
            this.#history.branch(name, this.#object, opts);

            this.#object = this.#history.currentSnapshot.snapshot;
        } else {
            //@ts-ignore
            this.#history.branch(name, Object.assign({}, exclude(this, ["latest", "commit", "revert"])), opts);

            Object.entries(this.#history.currentSnapshot.snapshot).forEach(([k, v]) => {
                //@ts-ignore
                this[k] = v;
            });
        }

        return this;
    }

    commit(message: string) {
        //@ts-ignore
        if (this.constructor === Zed) this.#history.commit(this.#object, message);
        //@ts-ignore
        else this.#history.commit(Object.assign({}, exclude(this, ["latest", "commit", "revert"])), message);

        return this;
    }

    revert(id: string) {
        this.#history.revert(id);

        if (this.constructor === Zed) this.#object = this.#history.currentSnapshot.snapshot;
        else
            Object.entries(this.#history.currentSnapshot.snapshot).forEach(([k, v]) => {
                //@ts-ignore
                this[k] = v;
            });

        return this;
    }

    static get Simple() {
        return this.#Simple;
    }
}
