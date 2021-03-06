/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

var chalk = require("chalk"),
    table = require("text-table");

var widthOfString = require("string-width");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
    return (count === 1 ? word : word + "s");
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {

    var output = "\n";
    var total = 0;
    var totalFixable = 0;
    var errors = 0;
    var warnings = 0;
    var summaryColor = "yellow";
    var greenColor = "green";

    results.forEach(function (result) {
        var messages = result.messages;

        if (messages.length === 0) {
            return;
        }

        total += messages.length;
        output += chalk.underline(result.filePath) + "\n";

        output += table(
                messages.map(function (message) {
                    var messageType;
                    // fixable
                    var fixableIcon = message.fix ? chalk[greenColor].bold("\u2713 ") : "";
                    if (message.fix) {
                        totalFixable++;
                    }
                    if (message.fatal || message.severity === 2) {
                        messageType = fixableIcon + chalk.red("error");
                        summaryColor = "red";
                        errors++;
                    } else {
                        messageType = fixableIcon + chalk.yellow("warning");
                        warnings++;
                    }

                    return [
                        "",
                        message.line || 0,
                        message.column || 0,
                        messageType,
                        message.message.replace(/\.$/, ""),
                        chalk.gray(message.ruleId || "")
                    ];
                }),
                {
                    align: ["", "r", "l"],
                    stringLength: function (str) {
                        var lines = chalk.stripColor(str).split("\n");
                        return Math.max.apply(null, lines.map(function (line) {
                            return widthOfString(line);
                        }));
                    }
                }
            ).split("\n").map(function (el) {
                return el.replace(/(\d+)\s+(\d+)/, function (m, p1, p2) {
                    return chalk.gray(p1 + ":" + p2);
                });
            }).join("\n") + "\n\n";
    });

    if (total > 0) {
        output += chalk[summaryColor].bold([
            "\u2716 ", total, pluralize(" problem", total),
            " (", errors, pluralize(" error", errors), ", ",
            warnings, pluralize(" warning", warnings), ")\n"
        ].join(""));
    }

    if (totalFixable > 0) {
        output += chalk[greenColor].bold("✓ " + totalFixable + " fixable " + pluralize("problem", totalFixable) +".\n");
        output += "Try to run: $ " + chalk.underline("textlint --fix [file]") +"\n";
    }

    return total > 0 ? output : "";
};
