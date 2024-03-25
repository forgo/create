/**
 * Structure for printing help flags
 * @typedef {Object} HelpFlag
 * @property {string} alias - The alias of the flag
 * @property {string} name - The name of the flag
 * @property {string} defaultValue - The default value of the flag
 * @property {boolean} required - Whether the flag is required
 * @property {string} description - The description of the flag
 */
export type HelpFlag = {
  alias: string;
  name: string;
  defaultValue: string;
  required: boolean;
  description: string;
};

/**
 * Print the help flags to the console
 * @param {HelpFlag[]} flags - The flags to print
 */
export function printFlagHelp(flags: Array<HelpFlag>): void {
  const HEADER_FLAG = "Flag";
  const HEADER_DEFAULT = "Default";
  const HEADER_REQUIRED = "Required";
  const HEADER_DESCRIPTION = "Description";

  const SPACE = " ";
  const COL_SPACING = 4;

  // Calculate the maximum flag and default value lengths for alignment
  let maxFlagLength = HEADER_FLAG.length;
  let maxDefaultLength = HEADER_DEFAULT.length;
  let maxRequiredLength = HEADER_REQUIRED.length;

  // Prepare flags and descriptions, calculating maximum lengths for alignment
  flags.forEach(({ alias, name, defaultValue, required }) => {
    const flag = `-${alias}, --${name}`;
    maxFlagLength = Math.max(maxFlagLength, flag.length);
    maxDefaultLength = Math.max(
      maxDefaultLength,
      defaultValue.toString().length
    );
    maxRequiredLength = Math.max(
      maxRequiredLength,
      (required ? "Yes" : "No").length
    );
  });

  // Header
  const h1 = HEADER_FLAG.padEnd(maxFlagLength);
  const h2 = HEADER_DEFAULT.padEnd(maxDefaultLength);
  const h3 = HEADER_REQUIRED.padEnd(maxRequiredLength);
  const h4 = HEADER_DESCRIPTION;

  console.info(
    "%c" + [h1, h2, h3, h4].join(SPACE.repeat(COL_SPACING)) + "%c",
    "font-weight: bold; color: blue;",
    ""
  );

  const s1 = "-".repeat(maxFlagLength);
  const s2 = "-".repeat(maxDefaultLength);
  const s3 = "-".repeat(maxRequiredLength);
  const s4 = "-".repeat(HEADER_DESCRIPTION.length);

  console.info([s1, s2, s3, s4].join(SPACE.repeat(COL_SPACING)));

  // Print each flag with description, aligning descriptions
  flags.forEach(({ alias, name, defaultValue, required, description }, i) => {
    const f = `-${alias}, --${name}`.padEnd(maxFlagLength);
    const v = defaultValue.toString().padEnd(maxDefaultLength);
    const r = (required ? "Yes" : "No").padEnd(maxRequiredLength);
    const d = description;
    console.info(
      [`%c${f}%c`, v, r, d].join(SPACE.repeat(COL_SPACING)) +
        (i === flags.length - 1 ? "\n" : ""),
      "color: orange",
      ""
    );
  });
}

/**
 * Print the help message to the console
 * @param {string} usage - The usage string
 * @param {HelpFlag[]} flags - The help flags to print
 */
export function printHelp(usage: string, flags: Array<HelpFlag>): void {
  console.info(`\nUsage: ${usage}\n`);
  printFlagHelp(flags);
}
