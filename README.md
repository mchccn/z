| [a](https://www.npmjs.com/package/@cursorsdottsx/a)
| [b](https://www.npmjs.com/package/@cursorsdottsx/b)
| [c](https://www.npmjs.com/package/@cursorsdottsx/c)
| [d](https://www.npmjs.com/package/@cursorsdottsx/d)
| [e](https://www.npmjs.com/package/@cursorsdottsx/e)
| [f](https://www.npmjs.com/package/@cursorsdottsx/f)
| [g](https://www.npmjs.com/package/@cursorsdottsx/g)
| [h](https://www.npmjs.com/package/@cursorsdottsx/h)
| [i](https://www.npmjs.com/package/@cursorsdottsx/i)
| [j](https://www.npmjs.com/package/@cursorsdottsx/j)
| [k](https://www.npmjs.com/package/@cursorsdottsx/k)
| [l](https://www.npmjs.com/package/@cursorsdottsx/l)
| [m](https://www.npmjs.com/package/@cursorsdottsx/m)
| [n](https://www.npmjs.com/package/@cursorsdottsx/n)
| [o](https://www.npmjs.com/package/@cursorsdottsx/o)
| [p](https://www.npmjs.com/package/@cursorsdottsx/p)
| [q](https://www.npmjs.com/package/@cursorsdottsx/q)
| [r](https://www.npmjs.com/package/@cursorsdottsx/r)
| [s](https://www.npmjs.com/package/@cursorsdottsx/s)
| [t](https://www.npmjs.com/package/@cursorsdottsx/t)
| [u](https://www.npmjs.com/package/@cursorsdottsx/u)
| [v](https://www.npmjs.com/package/@cursorsdottsx/v)
| [w](https://www.npmjs.com/package/@cursorsdottsx/w)
| [x](https://www.npmjs.com/package/@cursorsdottsx/x)
| [y](https://www.npmjs.com/package/@cursorsdottsx/y)
| **z**
|

**Z is for Zed**

# @cursorsdottsx/z

What? What's Zed? Ctrl Zed of course. Go Ctrl + Z your objects by employing a Version Control System for your JavaScript objects.

Zed is the most advanced object VCS because there are no other fucking objects VCS's on NPM. That's how useless it is!

Nevertheless this package has all you need to dictate your object's state through time.

#### Easy to install

Zed can be installed with the typical NPM or Yarn:

```bash
npm install @cursorsdottsx/e
```

```bash
yarn add @cursorsdottsx/e
```

#### Easy to use

```js
require("@cursorsdottsx/z");
```

```js
import "@cursorsdottsx/z";
```

Yay you actually installed this! Time to use it! Zed is available as a global class:

```js
const object = { foo: "bar" }; // hm a regular object is boring af

const zed = new Zed(object); // ah thats better

console.log(zed.latest.foo); // => "bar"

zed.latest.foo = "baz";

zed.commit("Change to baz");

console.log(zed.latest.foo); // => "baz"

zed.revert();

console.log(zed.latest.foo); // => "bar"
```

Zed also supports branching and reverting to a snapshot by id!

If you don't want the extra overhead of those things, you can alwayse use `Zed.Simple`:

```js
const object = { foo: "bar" }; // hm a regular object is boring af

const zed = new Zed.Simple(object); // ah thats better

console.log(zed.latest.foo); // => "bar"

zed.latest.foo = "baz";

zed.commit("Change to baz");

console.log(zed.latest.foo); // => "baz"

zed.revert();

console.log(zed.latest.foo); // => "bar"
```

It acts the same as Zed without multiple histories, but there are some changes to `revert` as you will see in the docs.

Don't want to use `zed.latest` all the time just to change the object? Well you can extend Zed or Zed.Simple!

That's right, Zed will behave differently when extended!

```js
class VersionedObject extends Zed {
	constructor() {
		super(zedOptions);
	}
}

const object = new VersionedObject();

object.property = "foo";

object.commit("I like foos");

object.property = "bar";

object.commit("bars are better");

object.revert();

object.property; // => "foo"
```

This is also inherently more type safe and goes well with TypeScript!

### Some boring ass documentation

### `new Zed(object, options)`

- `object` – The object to track.
- `options` – Options for Zed.
	- `master` – Name of the master branch.
	- `message` – Repo initialization message.

Creates a new Zed instance.

### `Zed.prototype.latest` 

The current snapshot (badly named I know).

### `Zed.prototype.commit(message)`
- `message` – Optional commit message.

Commits the current Zed object to the timeline.

### `Zed.prototype.revert(id)`
- `id` – Optional snapshot id to revert to.

Oh shit you messed up! Reverts the timeline to the last snapshot (or the snapshot with the id provided).

### `Zed.prototype.branch(name, options)`
- `name` – Name of the new branch.
- `options` – Options for the new branch.
	- `m` – Overwrite the branch that already exists.
	- `b` – Checkout the new branch.

Creates a new branch in the timeline.

### `Zed.prototype.checkout(name)`
- `name` – Name of the branch.

Switches to another branch.

---

### `new Zed.Simple(object, options)`

- `object` – The object to track.
- `options` – Options for Zed.
	- `master` – Name of the master branch.
	- `message` – Repo initialization message.

Creates a new Zed instance.

### `Zed.Simple.prototype.latest` 

The current snapshot (badly named I know).

### `Zed.Simple.prototype.commit(message)`
- `message` – Optional commit message.

Commits the current Zed object to the timeline.

### `Zed.Simple.prototype.revert(times, force)`
- `times` – How many times do we wanna roll' back?
- `force` – Force rollback to earliest change if needed.

Oh shit you messed up! Reverts the timeline to the last snapshot.

[npm abc's homepage](https://codepen.io/cursorsdottsx/full/KKWNRaY)
