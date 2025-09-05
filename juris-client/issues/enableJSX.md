# How to enable JSX

## Changes to juris.js:

Added anywhere in the file:

 ```
const h = (tag, attrs, ...children) => ({
    [typeof tag === 'function' ? tag.name : tag]: {
      ...attrs,
      children,
    },
});
```

This converts the format usually produced by the JSX to JS converters into the format Juris expects.  The name `h` is customary, I don't know why.

To make it available elsewhere, towards the end, I added `h` to the exports:

```
// Browser-only exports (script tag compatible)
if (typeof window !== 'undefined') {
    window.Juris = Juris;
    window.jurisVersion = jurisVersion;
    window.jurisLinesOfCode = jurisLinesOfCode;
    window.jurisMinifiedSize = jurisMinifiedSize;
    window.h = h; // <-- added
    Object.freeze(Juris);
    Object.freeze(Juris.prototype);
}

// Basic CommonJS for compatibility
if (typeof module !== 'undefined' && module.exports) {           
    module.exports.Juris = Juris;
    module.exports.default = Juris;
    module.exports.jurisVersion = jurisVersion;
    module.exports.jurisLinesOfCode = jurisLinesOfCode;
    module.exports.jurisMinifiedSize = jurisMinifiedSize;
    module.exports.h = h; // <-- added
}
```

Finally, changed the `register` method in `ComponentManager`:

```
    register(name, componentFn) {
        log.ei && console.info(log.i('Component registered', { name }, 'application'));
        const fn = Object.defineProperty(componentFn, "name", {
            value: name,
            writable: false,
        });
        this.components.set(name, fn);
        return fn;
    }
```

### Changes to component registration

The only change is that now the `registerComponent` does return a value, which can be exported:

```
export const TableRowButtons = juris.registerComponent(
  'TableRowButtons',
  ({ action, id, message }, { getState }) => ({
    ....
  })
);
```
### Changes in usage

The extension of the files that do contain JSX need to change from `.js` to `.jsx`.  This not only changes the behaviour of the bundler but of VsCode itself and extensions such as Prettier which will format and highlight the file accordingly.

Now other source files can have something to import from those components:

```
import { TableRowButtons } from '@components/Buttons.js';
```

And then they can be used:

```
    const rowVendedor = (vendedor) => {
      const id = vendedor.id;
      return (
        <tr key={id}>
          <td>{vendedor.nombre}</td>
          <td>{vendedor.email}</td>
          <td class="text-center">
            <TableRowButtons
              action={rowActionsHandler}
              id={id}
              message={vendedor.nombre}
            />
          </td>
        </tr>
      );
    };
```

### Changes in the bundler

I use `rollup.js` which supports JSX natively, I only had to add the following configuration setting to `rollop.config.js`

```
  jsx: {
    mode: 'classic',
    factory: 'h',
    importSource: 'juris',
  },
```

The typescript compiler, `tsc`, also has [jsx configuration options](https://www.typescriptlang.org/tsconfig/#jsx) as do most other bundlers either natively (most of them) or via plugins.