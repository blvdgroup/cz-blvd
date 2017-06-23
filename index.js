'use strict'

const readPkg = require('read-pkg-up')
const truncate = require('cli-truncate')
const wrap = require('wrap-ansi')
const types = require('./lib/types')

/**
 * Create inquier.js questions object trying to read `types` and `scopes` from the current project
 * `package.json` falling back to nice default :)
 *
 * @param {Object} res Result of the `readPkg` returned promise
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function createQuestions(res) {
  const config = res.pkg.config || {}
  const emojiConfig = config['cz-emoji'] || {}

  let initialQ = [
    {
      type: 'list',
      name: 'type',
      message: "Select the type of change you're committing:",
      choices: emojiConfig.types || types
    }
  ]

  if (typeof emojiConfig.monorepo !== 'undefined' && emojiConfig.monorepo.repos !== 'undefined') {
    if (Array.isArray(emojiConfig.monorepo.repos)) {
      initialQ = [...initalQ, {
        type: 'list',
        name: 'package',
        message: 'Specify the package updated:',
        choices: [...emojiConfig.monorepo.repos, { name: '[N/A]', value: '' }]
      }]
    }
  }

  return [...initialQ,
    {
      type: 'input',
      name: 'scope',
      message: 'Specify a scope:',
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Write a short description:'
    },
    {
      type: 'input',
      name: 'body',
      message: 'Provide a longer description:'
    },
    {
      type: 'input',
      name: 'issues',
      message: 'List any issues closed:'
    },
    {
      type: 'input',
      name: 'breaking',
      message: 'List any breaking changes:'
    }
  ]
}

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @return {String} Formated git commit message
 */
function format(answers) {
  // parentheses are only needed when a scope is present
  const scope = answers.scope || answers.package
    ? '(' +
      (answers.package ? answers.package.trim() + ':' : '') +
      (answers.scope ? answers.scope.trim() : '')
      + ') '
    : ''

  // build head line and limit it to 50 (not including breaking prompt and such)
  // we hard limit to fifty to keep the rest of the commit line from not breaking 72
  // i'm more experimenting w/fifty as a hard limit and realistically, we could go higher
  // but let's see how this goes
  const head =
    (answers.breaking ? '[BREAKING] ' : '') +
    answers.type + ' ' +
    scope +
    truncate(answers.subject.trim(), 50)

  // wrap body at 72
  const body = wrap(answers.body, 72)

  const addFooter = answers.issues || answers.breaking
  const footer =
    (answers.issues ? 'Closes ' + answers.issues : '') +
    (answers.breaking ? 'Breaking Changes: ' + answers.breaking : '')

  return (head + '\n\n' + body + (addFooter ? '\n\n' + footer : ''))
}

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
  prompter: function(cz, commit) {
    readPkg()
      .then(createQuestions)
      .then(cz.prompt)
      .then(format)
      .then(commit)
  }
}
