# Rule Sets

Typescript package which creates a rule set that allows to define dependencies and exclusiveness between packages

## Development

Run the below command at the package root to install all dependencies and generate the `node_modules` directory:

### `yarn install`

Run the below command at the package root to generate the `dist` folder with the transpiled javascript and corresponding types.
You can automatically see your changes reflect in your project of choice assuming linking is complete, as we are using a watcher in package.json:

### `yarn build`

## Test

We are using mocha and chai along with nyc to create unit tests and display the code coverage each time, to run the tests run the below command:

### `yarn test`

## Installation as package

*This project has not been published to an npm registry and therefore can only be used locally for now:*

Run the below command at the package root to install all dependencies and generate the `node_modules` directory:

### `yarn install`

Run the below command at the package root to generate the `dist` folder with the transpiled javascript and corresponding types.
You can automatically see your changes reflect in your project of choice assuming linking is complete, as we are using a watcher in package.json:

### `yarn build`

Run the below command at the package root should you wish to link this package to a local repository:

### `yarn link`

Run the below command at the root of the project that you wish to use this package in to complete the linking:

### `yarn link rulesets`

## Example usage in other projects

```
import { RuleSet, Pkgs } from "rulesets";

...

const set = new RuleSet()
set.addDep('a', 'b');

const pkgs = new Pkgs(set);
pkgs.toggle('b');
```