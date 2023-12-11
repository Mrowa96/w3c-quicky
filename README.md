# w3c-quicky

Check your code according to w3c rules in fast and efficient way 🔥

## How to use it?

1. Install it using `npm i -DE w3c-quicky`.
2. Now you can execute it through npx like this `npx w3c-quicky \"./path/to/dir/**/*.html\"`.

   You don't need to wrap your glob pattern in `""` but it's recommended. Many shells are automatically resolving globs in not the most optimal way.

3. If you need help check out other options `npx w3c-quicky --help`

### Config file

Config file will help you have more control over validated files.
File is **optional**, but if you decided to use it has to be placed in your project **root** directory and be named as `.w3cquicky.json`.

Content of the file has structe like below.

```json
{
  "excludedPaths": [],
  "ignoredRules": []
}
```

- excludedPaths is an `string[]` whcih takes static paths or [glob](https://www.npmjs.com/package/glob) patterns. Paths matching this option will be excluded from validation
- ignoredRules is also an `string[]` which takes validation messages or parts of it and return validation results with ommited rules.

Example:

```json
{
  "excludedPaths": ["**/some-specific-file.html", "**/*/*test*.html"],
  "ignoredRules": [
    "Trailing slash on void elements has no effect and interacts badly with unquoted attribute values.",
    "Cache-Control"
  ]
}
```

Excluding paths or ignoring rules is not possible through command line at the moment for lower readability reasons.

## Troubleshooting

- **Validation failed: Too many requests. Please wait a bit before trying again.**

  Unfortunately, validation server has limits and if you try to check too many files in short period of time it will return 429 status code. If you can, please try to limit included files to check or do it less frequently.

## For developers

### How to work with code?

- Install dependencies via `npm i`
- Start building process with watcher `npm start`
- You can test it through `npm run bin` which will tets files from `test_files` directory

### TODO:

- Add tests
- Add benchmarks
- Validate response body
- Setup github actions
- Add checksums and cache results?
