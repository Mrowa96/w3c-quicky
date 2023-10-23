# w3c-quicky

Check your code according to w3c rules in fast and efficient way 🔥

## How to use it?

1. Install it using `npm i -DE w3c-quicky`.
2. Now you can execute it through npx like this `npx w3c-quicky ./path/to/dir/**/*.html`.
3. If you need help check out other options `npx w3c-quicky --help`

### Config file

Config file will help you have more control over validated files. File is **optional**, but if you decided to use it has to be placed in your project **root** directory and be named as `.w3cquicky.json`.

Content of the file has structed like below.

```json
{
  "excludedPaths": [],
  "ignoredRules": []
}
```

- excludedPaths is an `string[]` whcih takes static paths or [glob](https://www.npmjs.com/package/fast-glob) patterns. Paths matching this option will be excluded from validation
- ignoredRules is also an `string[]` which takes valdiation messages or parts of it and return validation results with ommited rules.

Example:

```json
{
  "excludedPaths": [
    // Filer out some-specific-file.html
    "**/some-specific-file.html",
    // Filter out all files which contain test in name
    "**/*/*test*.html"
  ],
  "ignoredRules": [
    // Specific message
    "Trailing slash on void elements has no effect and interacts badly with unquoted attribute values.",
    // Any message containing "Cache-Control"
    "Cache-Control"
  ]
}
```

Excluding paths or ignoring rules is not possible through command line at the moment for lower readability reasons.

## How to work with code?

- Install dependencies via `npm i`
- Start building process with watcher `npm start`
- Run script via `node ./dist/bin/index.js <sources>` or use Run and Debug tool in VSCode

## TODO:

- Add tests
- Add benchmarks
- Validate response body
- Setup github actions
- Add checksums and cache results?
