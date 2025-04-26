/**
 * Github action script to generate a comment for visual regression tests.
 */

/**
 * Creates a PR comment with the visual regression results.
 */
export default function createVisualRegressionPrComments({require, core}) {
    const fs = require('fs');
    const path = require('path');
    try {
        const configPath = 'tools/visual-diff/config/.screenshot-sets.json';
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const comparisons = config.comparisons || {};

        for (const [name, comparison] of Object.entries(comparisons)) {
            try {
                const reportPath = path.join(comparison.reportDirectory, 'reg.json');
                if (fs.existsSync(reportPath)) {
                    const results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
                    const params = getVisualDiffResults(results);
                    const commentBody = createCommentBody({
                        ...params,
                        shortDescription: false,
                    });
                    core.setOutput('comment', commentBody);

                }
            } catch (err) {
                console.error(`Error processing comparison ${name}:`, err);
            }
        }

    } catch (error) {
        console.error('Error generating PR comment:', error);
    }
}

/**
 * Parse regviz results file to get results for the message body.
 *
 * @param {object} results - config object.
 *
 * @returns {{passedItemsCount, failedItemsCount, deletedItemsCount, shortDescription: boolean}}
 */
function getVisualDiffResults(results) {
    console.log(results);
    return {
        failedItemsCount: results.failedItems ? results.failedItems.length : 0,
        newItemsCount: results.newItems ? results.newItems.length : 0,
        deletedItemsCount: results.deletedItems ? results.deletedItems.length : 0,
        passedItemsCount: results.passedItems ? results.passedItems.length : 0,
    };
}

/**
 * Adapted from: https://github.com/reg-viz/reg-suit
 * https://raw.githubusercontent.com/reg-viz/reg-suit/refs/heads/master/packages/reg-notify-github-with-api-plugin/src/gh-api-notifier-plugin.ts
 */

/**
 * Creates a table item.
 * @param itemCount - table cell reference
 * @param header - header of table.
 * @returns {null|*[]}
 */
function tableItem(itemCount, header) {
    return  Number(itemCount) ===  0 ? null : [itemCount, header];
}

/**
 * Returns a small table with the item counts.
 *
 * @param {Object} eventBody - The event data used to create the comment.
 * @param {number} eventBody.failedItemsCount - Number of items that failed the comparison.
 * @param {number} eventBody.newItemsCount - Number of newly added items.
 * @param {number} eventBody.deletedItemsCount - Number of deleted items.
 * @param {number} eventBody.passedItemsCount - Number of items that passed the comparison.
 *
 * @return {string} The formatted table.
 *
 * @example
 * | 🔴 Changed | ⚪️ New | 🔵 Passing |
 * | ---        | ---    | ---        |
 * | 3          | 4      | 120        |
 */
function shortDescription({
                              failedItemsCount,
                              newItemsCount,
                              deletedItemsCount,
                              passedItemsCount,
                          }) {
    const descriptions = [
        tableItem(failedItemsCount, ":red_circle:  Changed"),
        tableItem(newItemsCount, ":white_circle:  New"),
        tableItem(deletedItemsCount, ":black_circle:  Deleted"),
        tableItem(passedItemsCount, ":large_blue_circle:  Passing"),
    ];

    const filteredDescriptions = descriptions.filter((item) => item != null);

    const headerColumns = filteredDescriptions.map(([_, header]) => header);
    const headerDelimiter = filteredDescriptions.map(() => " --- ");
    const itemCount = filteredDescriptions.map(([itemCount]) => itemCount);

    return [
        `| ${headerColumns.join(" | ")} |`,
        `| ${headerDelimiter.join(" | ")} |`,
        `| ${itemCount.join(" | ")} |`,
    ].join("\n");
}

/**
 * Creates a long description.
 *
 * @param {Object} eventBody - The event data used to create the comment.
 * @param {string} [eventBody.reportUrl] - Optional URL to the visual regression report.
 * @param {number} eventBody.failedItemsCount - Number of items that failed the comparison.
 * @param {number} eventBody.newItemsCount - Number of newly added items.
 * @param {number} eventBody.deletedItemsCount - Number of deleted items.
 * @param {number} eventBody.passedItemsCount - Number of items that passed the comparison.
 * @param {boolean} eventBody.shortDescription - Whether to use a short description format.
 *
 * @return {string} The formatted comment body.
 */
function longDescription(eventBody) {
    const lines = [];
    lines.push(new Array(eventBody.failedItemsCount + 1).join(":red_circle: "));
    lines.push(new Array(eventBody.newItemsCount + 1).join(":white_circle: "));
    lines.push(new Array(eventBody.deletedItemsCount + 1).join(":black_circle: "));
    lines.push(new Array(eventBody.passedItemsCount + 1).join(":large_blue_circle: "));
    lines.push("");
    lines.push(`<details>
                <summary>What do the circles mean?</summary>
                The number of circles represent the number of changed images. <br />
                :red_circle: : Changed items,
                :white_circle: : New items,
                :black_circle: : Deleted items, and
                :large_blue_circle: : Passing items
                <br />
             </details><br />`);
    return lines.join("\n");
}

/**
 * Creates a comment body.
 * @param {Object} eventBody - The event data used to create the comment.
 * @param {string} [eventBody.reportUrl] - Optional URL to the visual regression report.
 * @param {number} eventBody.failedItemsCount - Number of items that failed the comparison.
 * @param {number} eventBody.newItemsCount - Number of newly added items.
 * @param {number} eventBody.deletedItemsCount - Number of deleted items.
 * @param {number} eventBody.passedItemsCount - Number of items that passed the comparison.
 * @param {boolean} eventBody.shortDescription - Whether to use a short description format.
 * @returns {string} The formatted comment body.
 */

function createCommentBody(eventBody) {
    const lines = [];
    if (eventBody.failedItemsCount === 0 && eventBody.newItemsCount === 0 && eventBody.deletedItemsCount === 0) {
        lines.push(`:sparkles: :sparkles: **That's perfect, there is no visual difference!** :sparkles: :sparkles:`);
        if (eventBody.reportUrl) {
            lines.push("");
            lines.push(`You can check the report out [here](${eventBody.reportUrl}).`);
        }
    } else {
        lines.push("**reg-suit detected visual differences.**");
        lines.push("");
        if (eventBody.reportUrl) {
            lines.push("");
            lines.push(`Check [this report](${eventBody.reportUrl}), and review them.`);
            lines.push("");
        }

        if (eventBody.shortDescription) {
            lines.push(shortDescription(eventBody));
        } else {
            lines.push(longDescription(eventBody));
        }

        lines.push(
            `<details>
          <summary>How can I change the check status?</summary>
          If reviewers approve this PR, the reg context status will be green automatically.
          <br />
       </details><br />`,
        );
    }
    return lines.join("\n");
}
