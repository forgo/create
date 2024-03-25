/**
 * Returns an array of all string values of an enum object
 * @param enumObj - The enum object to extract string values from
 * @returns An array of all string values of the enum object
 */
export function enumStringArray(enumObj: {
  [s: string]: string | number;
}): Array<string> {
  const values = Object.values(enumObj);
  // Filter to avoid numeric values for reverse-mapped enums
  return values.filter((value): value is string => typeof value === "string");
}

/**
 * Returns a string of all string values of an enum object joined by a delimiter
 * @param enumObj - The enum object to extract string values from
 * @param delimiter - The delimiter to join the string values with
 * @returns A string of all string values of the enum object joined by the delimiter
 */
export function enumStringJoin(
  enumObj: { [s: string]: string | number },
  delimiter: string = ", "
): string {
  return enumStringArray(enumObj).join(delimiter);
}

/**
 * Checks if a string is a value in an enum object
 * @param enumObj - The enum object to check the string against
 * @param value - The string value to check
 * @returns Whether the string is a value in the enum object
 */
export function isStringInEnum(
  enumObj: { [s: string]: string | number },
  value: string
): boolean {
  return enumStringArray(enumObj).includes(value);
}
