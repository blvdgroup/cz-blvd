# cz-blvd

> Commitizen adapter for projects within the blvd group. Equal amounts of cutesy and practical. Forked from [cz-emoji](https://github.com/ngryman/cz-emoji). Takes inspiration from conventional-commits, but has significantly more flair.

_Requires Node 8+, or whenever they implemented the ... operator. I'm not actually sure, but Node 8 is LTS in like a few months anyway so just go with that._

```sh
? Select the type of change you are committing: (Use arrow keys)
❯ feature   🌟  A new feature
  fix       🐞  A bug fix
  docs      📚  Documentation change
  refactor  🎨  A code refactoring change
  chore     🔩  A chore change
  style     ✨  A style update or lint cleanup
  perf      🏁  A change which improves performance
  test      ⚡  A test change
```

## Install

```bash
npm install --global cz-blvd

# set as default adapter for your projects
echo '{ "path": "cz-blvd" }' > ~/.czrc
```

## Usage

```sh
$ git cz
```

### Monorepo support

The repos don't have to match your repo names exactly, but they will be used in the scope.

```json
{
  "config": {
    "cz-emoji": {
      "monorepo": {
        "repos": [
          "login",
          "swipe",
          "admit"
        ]
      }
    }
  }
}
```

## License

MIT © the blvd group

[commitizen]: https://github.com/commitizen/cz-cli
[Inquirer.js]: https://github.com/SBoudrias/Inquirer.js/
