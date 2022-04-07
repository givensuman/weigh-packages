# weigh-packages 🏋️

A lightweight CLI tool to see the size of your package dependencies

Built for Node.js

To install, run:

```bash
# npm
npm i -g weigh-packages

# or, if you prefer yarn
yarn global add weigh-packages

# remember to use sudo on Linux
```

Then run the script in any folder with a package.json!

```
cd my-project && weigh-packages
```

By default it sorts in the order of your package.json, which should be alphabetical. You can add `--size` or `--files` as a flag to sort by package size or file count, respectively:

```bash
weigh-packages --size
```
👇

|name |version |size (kB) |size (%) |files |dependencies |license
|-- |-- |-- |-- |-- |-- |--
|node-fetch |105.816 |38 |3.2.3 |17 |3 |MIT
|chalk |41.336 |15 |5.0.1 |12 |0 |MIT
|cli-table3 |41.117 |15 |0.6.1 |9 |2 |MIT
|cli-spinner |85.107 |31 |0.2.10 |7 |0 |MIT
| | 
|total | |273.376 |100 |45 |5 |

Enjoy!