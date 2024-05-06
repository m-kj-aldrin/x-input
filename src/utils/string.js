/**@param {string} string */
export function stringBoolean(string) {
    if (string) {
        return string == "true" ? true : string == "false" ? false : undefined;
    }
}

/**@param {string} input */
export function parseKeyValuePairs(input) {
    const result = {};
    const pairs = input.split(",");

    pairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        result[key.trim()] = convertValue(value.trim());
    });

    return result;
}

function convertValue(value) {
    // Convert to number if applicable
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return parseFloat(value);
    }
    // Convert to boolean if applicable
    if (value.toLowerCase() === "true") {
        return true;
    } else if (value.toLowerCase() === "false") {
        return false;
    }
    // Return as string if no other conversions apply
    return value;
}
