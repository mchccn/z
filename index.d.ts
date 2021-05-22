export default class Zed<T extends object> {
    #private;
    constructor(object: T | any, opts?: {
        master?: string | undefined;
        message?: string | undefined;
    });
    get latest(): object | undefined;
    checkout(name: string): this;
    branch(name: string, opts?: {
        m: boolean;
        b: boolean;
    }): this;
    commit(message: string): this;
    revert(id: string): this;
    static get Simple(): {
        new <T extends object>(object?: T | undefined): {
            "__#5@#object"?: object | undefined;
            "__#5@#snapshots": object[];
            readonly latest: object | undefined;
            commit(): any;
            revert(times?: number | undefined, force?: boolean | undefined): any;
        };
    };
}
