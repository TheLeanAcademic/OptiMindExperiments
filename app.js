const fs = require('fs');
const path = require('path');

/**
 * Parses CSV file and handles complex quoted fields.
 * @param {string} csvFilePath - The path to the CSV file.
 * @returns {Array} Parsed CSV data.
 */
function parseCSV(csvFilePath) {
    const data = fs.readFileSync(csvFilePath, 'utf8');
    const rows = [];
    const regex = /(?:,\s*|^)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
    let line;
    let result = [];

    try {
        const lines = data.split('\n');
        lines.forEach((line, index) => {
            result = [];
            let match;
            while ((match = regex.exec(line)) !== null) {
                result.push(match[1] ? match[1].replace(/""/g, '"') : match[2]);
            }
            if (result.length > 0) {
                rows.push(result);
            }
        });
    } catch (error) {
        console.error(`Error parsing line ${index + 1}: ${error.message}`);
    }

    console.log('Parsed rows:', rows);
    return rows;
}

module.exports = { parseCSV };