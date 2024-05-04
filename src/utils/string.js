/**@param {string} string */
export function stringBoolean(string) {
  if (string) {
    return string == "true" ? true : string == "false" ? false : undefined;
  }
}
