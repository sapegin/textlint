// LICENSE : MIT

// Original code is https://github.com/azer/prettify-error
// Author : azer
"use strict";
var format = require("@azu/format-text");
var chalk = require("chalk");
var padStart = require('string.prototype.padstart');
var style = require("@azu/style-format");
var stripAnsi = require("strip-ansi");
var pluralize = require("pluralize");
// width is 2
var widthOfString = require("string-width");
// color set
var summaryColor = "yellow";
var greenColor = "green";
var template = style('{grey}{ruleId}: {red}{title}{reset}\n'
    + '{grey}{filename}{reset}\n'
    + '    {red}{paddingForLineNo}  {v}{reset}\n'
    + '    {grey}{previousLineNo}. {previousLine}{reset}\n'
    + '    {reset}{failingLineNo}. {failingLine}{reset}\n'
    + '    {grey}{nextLineNo}. {nextLine}{reset}\n'
    + '    {red}{paddingForLineNo}  {^}{reset}\n'
    + '');


/**
 *
 * @param {string} code
 * @param {TextLintMessage} message
 * @returns {*}
 */
function failingCode(code, message) {
    var result = [];
    var lines = code.split('\n');
    var i = message.line - 3;
    while (++i < message.line + 1) {
        if (i + 1 !== message.line) {
            result.push({
                line: message.line - (message.line - i - 1),
                code: lines[i]
            });
            continue;
        }

        result.push({
            line: message.line,
            col: message.column,
            code: lines[i],
            failed: true
        });
    }

    return result;
}

function showColumn(codes, ch) {
    var result = '';
    var codeObject = codes[1];
    var sliced = codeObject.code.slice(0, codeObject.col);
    var width = widthOfString(sliced);
    if (width <= 0) {
        return "";
    }
    var i = width - 1;

    while (i--) {
        result += ' ';
    }

    return result + ch;
}
/**
 *
 * @param {string} code
 * @param {string} filePath
 * @param {TextLintMessage} message
 * @returns {*}
 */
function prettyError(code, filePath, message) {
    if (!code) {
        return;
    }
    var parsed = failingCode(code, message);
    var previousLineNo = String(parsed[0].line);
    var failingLineNo = String(parsed[1].line);
    var nextLineNo = String(parsed[2].line);
    var linumlen = Math.max(previousLineNo.length, failingLineNo.length,
        nextLineNo.length);
    return format(template, {
        ruleId: message.ruleId,
        title: message.message,
        filename: filePath + ":" + message.line + ":" + message.column,
        previousLine: parsed[0].code ? parsed[0].code : "",
        previousLineNo: padStart(previousLineNo, linumlen),
        previousColNo: parsed[0].col,
        failingLine: parsed[1].code,
        failingLineNo: padStart(failingLineNo, linumlen),
        failingColNo: parsed[1].col,
        nextLine: parsed[2].code ? parsed[2].code : "",
        nextLineNo: padStart(nextLineNo, linumlen),
        nextColNo: parsed[2].col,
        paddingForLineNo: padStart('', linumlen),
        '^': showColumn(parsed, '^'),
        'v': showColumn(parsed, 'v')
    });
}

/**
 *
 * @param {TextLintResult[]} results
 * @param {TextLintFormatterOption} options
 * @returns {string}
 */
function formatter(results, options) {
    // default: true
    var useColor = options.color !== undefined ? options.color : true;
    var output = "";
    var total = 0;
    var errors = 0;
    var warnings = 0;
    var totalFixable = 0;
    results.forEach(function (result) {
        var code = require("fs").readFileSync(result.filePath, "utf-8");
        var messages = result.messages;
        if (messages.length === 0) {
            return;
        }
        total += messages.length;
        messages.forEach(function (message) {
            // fixable
            var fixableIcon = message.fix ? chalk[greenColor].bold("\u2713 ") : "";
            if (message.fix) {
                totalFixable++;
            }
            if (message.fatal || message.severity === 2) {
                errors++;
            } else {
                warnings++;
            }
            var r = fixableIcon + prettyError(code, result.filePath, message);
            if (r) {
                output += r + "\n";
            }
        });
    });

    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errors, pluralize(" error", errors), ", ",
            warnings, pluralize(" warning", warnings), ")\n"
        ].join(""));
    }

    if (totalFixable > 0) {
        output += chalk[greenColor].bold("✓ " + totalFixable + " fixable " + pluralize("problem", totalFixable) + ".\n");
        output += "Try to run: $ " + chalk.underline("textlint --fix [file]") + "\n";
    }

    if (!useColor) {
        return stripAnsi(output);
    }
    return output;
}
module.exports = formatter;
module.exports.prettyError = prettyError;