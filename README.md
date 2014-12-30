# textlint [![Build Status](https://travis-ci.org/azu/textlint.svg)](https://travis-ci.org/azu/textlint)

The pluggable linting tool for text(plain text and markdown).

It is similar to [ESLint](http://eslint.org/ "ESLint").

## Installation

```
npm install textlint -g
```

## Usage

![lint result](http://monosnap.com/image/9FeIQr95kXjGPWFjZFRq6ZFG16YscF.png)

TODO: more more document


```
$ textlint README.md
```

## CLI

See help.

```
$ textlint -h
textlint [options] file.md [file.txt] [dir]

Options:
  -h, --help                 Show help.
  --rulesdir [path::String]  Set rules from this directory and set all default rules to off.
  -f, --format String        Use a specific output format. - default: stylish
  -v, --version              Outputs the version number.
  --ext [String]             Specify text file extensions.
  --no-color                 Enable color in piped output.
  -o, --output-file path::String  Enable report to be written to a file.
  --quiet                    Report errors only. - default: false
  --stdin                    Lint code provided on <STDIN>. - default: false
```

### Build-in formatters

See [formatters](lib/formatters).

Currently, you can use "stylish" (defaults), "compact", "checkstyle", "jslint-xml", "junit", "tap", "pretty-error".

e.g.) use pretty-error.js

```
$ textlint -f pretty-error file.md
```

## How to create rules?

Please see docs/

- [docs/txtnode.md](docs/txtnode.md)
    - What is is TxtNode?
- [docs/create-rules.md](docs/create-rules.md)
    - How to create rules?
    - Tutorial: creating `no-todo` rule.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT

and

`lib/load-rules.js`, `util/traverse.js`, `cli.js` and formatters are:

    ESLint
    Copyright (c) 2013 Nicholas C. Zakas. All rights reserved.
    https://github.com/eslint/eslint/blob/master/LICENSE

## Related Work

[SCG: TextLint](http://scg.unibe.ch/research/textlint "SCG: TextLint") is similar project.

[SCG: TextLint](http://scg.unibe.ch/research/textlint "SCG: TextLint")'s place is equal to my `textlint`(Fortuitously, project name is equal too!).

![concept](http://monosnap.com/image/Gr9CGbkSjl1FXEL0LIWzNDAj3c24JT.png)

via [Natural Language Checking with Program Checking Tools](http://www.slideshare.net/renggli/text-lint "Natural Language Checking with Program Checking Tools")

## Acknowledgements

Thanks to [ESLint](http://eslint.org/ "ESLint").
