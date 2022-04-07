# weigh-packages 🏋️

A lightweight CLI tool to see the size of your package dependencies

Built for Node.js

To install, run:

```bash
# npm
npm i -g weigh-packages

# or, if you prefer yarn
yarn global add weigh-packages
```

Then run the script in any folder with a package.json!

```
cd my-project && weigh-packages
```

By default it sorts in the order of your package.json, which should be alphabetical. You can add `--size` or `--files` as a flag to sort by package size or file count, respectively:

```bash
weigh-packages --size
```

|name |size (kB) |size (%) |files
|--- |--- |--- |---

Enjoy!