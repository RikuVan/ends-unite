# Unionize = ❤️

## How to start development for the application

    # With type checking
    npm run dev

    # Transpile only
    npm start

Execute the command and you can run & test the application on `localhost:1234` in the browser.

## How to build the application

    npm build

The default output directory is `/dist`. You can change the destination wherever you want.

```
// package.json
// ...
"scripts": {
  // ...
  "build": "... parcel build ./src/index.html -d YOUR_OUTPUT_DIR --public-url '/'" <- Change here
}
// ...
```

## How to test the application

    yarn test       # run test once
    yarn test:watch # watch mode

You have to create `__tests__` directory at the same location of files which you want to test.
Test file's name should be `SOURCE.test.ts/tsx/js` or `SOURCE.spec.ts/tsx/js`.

## Miscellaneous

This Project uses pre-commit hook for `prettier` and testing application.  
If you don't like it, remove the `husky` package from your repository and erase following scripts.

    npm uninstall husky

then

```
// package.json
// ...
"husky": {
  "hooks": {
    "pre-commit": "npm run prettify && npm run test"
  }
},
// ...
```
