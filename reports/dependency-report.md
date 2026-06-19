# Dependency Report

## Missing packages detected by depcheck

- axios (used in `src/services/api.js`) — add to `dependencies`.
- @tailwindcss/forms (used in `tailwind.config.extended.js`) — add to `devDependencies` or as appropriate.

## Unused packages

- depcheck reported no unused dependencies in `dependencies`.

## Extraneous / duplicate packages (from `npm ls`)

- Extraneous packages found in node_modules (likely from dev installs):
  - @emnapi/core, @emnapi/runtime, @emnapi/wasi-threads, @img/sharp-wasm32, @napi-rs/wasm-runtime, @tybys/wasm-util, tslib

## Recommendations

- Add `axios` to `dependencies` and `@tailwindcss/forms` to devDependencies or install as required.
- Review and remove extraneous packages if they are not needed in production.
- Run `npm audit` and address vulnerabilities as appropriate.
