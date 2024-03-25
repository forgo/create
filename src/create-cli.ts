import { parseArgs } from "@std/cli/parse_args";
import { enumStringJoin } from "./enums/enums.ts";
import { HelpFlag, printHelp } from "./cli/cli.ts";
import { isStringInEnum } from "./enums/enums.ts";
import { isValidArtifactName } from "./validation/isValidName.ts";

/**
 * The type of boilerplate to create
 */
export enum CreateType {
  JSR = "jsr", // Public JSR Package to publish to jsr.io
}

/**
 * Options for creating boilerplate files
 */
export type CreateOptions = {
  name: string;
  type: CreateType;
};

// Get a human readable list of options for the CreateType enum
const optionsCreateType = enumStringJoin(CreateType, " | ");

/**
 * Get the CLI arguments for creating boilerplate files
 * @returns The CLI arguments for creating boilerplate files
 * @throws If the CLI arguments are invalid
 */
export function getArgsCreate() {
  // Parse CLI arguments
  const parsedArgs = parseArgs(Deno.args, {
    boolean: ["dry", "help", "name"],
    string: ["type"],
    alias: {
      d: "dry",
      h: "help",
      t: "type",
    },
    default: {
      dry: false,
      help: false,
      type: null,
    },
  });

  // Extract the name from the CLI arguments
  const nonFlags = parsedArgs._;
  if (nonFlags.length === 0) {
    throw new Error("Name required");
  }
  const name = String(nonFlags[0]);

  const type = String(parsedArgs.type) ?? null;

  // Validate the name
  const { valid, suggestion } = isValidArtifactName(name);
  if (!valid) {
    throw new Error(`Invalid name '${name}': ${suggestion}`);
  }
  if (type === null || !isStringInEnum(CreateType, type)) {
    throw new Error(`Type required: ${optionsCreateType}`);
  }

  // Return the parsed arguments
  return {
    dry: parsedArgs.dry,
    help: parsedArgs.help,
    name,
    type: parsedArgs.type as CreateType,
  };
}

/**
 * Print the help message for creating boilerplate files
 */
export function printHelpCreate() {
  const usage = "deno run create.ts [flags] [name]";

  const flags: Array<HelpFlag> = [
    {
      alias: "d",
      name: "dry",
      defaultValue: "false",
      required: false,
      description: "Show what would be output to disk",
    },
    {
      alias: "h",
      name: "help",
      defaultValue: "false",
      required: false,
      description: "Display this help and exit",
    },
    {
      alias: "t",
      name: "type",
      defaultValue: "null",
      required: true,
      description: optionsCreateType,
    },
  ];

  printHelp(usage, flags);
}

/**
 * Print information to the console
 * @param data - The data to print
 */
export function printInfoCreate(...data: unknown[]) {
  console.log("");
  console.info(...data);
  console.log("");
}

/**
 * Print an error to the console
 * @param data - The data to print
 */
export function printErrorCreate(...data: unknown[]) {
  console.log("");
  console.error(...data);
  console.log("");
}

/**
 * Print information indicating that the CLI is running
 * @param options - The options for creating boilerplate files
 */
export function printInfoRunning({ name, type }: CreateOptions) {
  // Run the CLI tool to generate files
  printInfoCreate(
    `%cRunning @forgo/create CLI\n  %cname=%c"${name}"%c\n  type=%c"${type}"%c`,
    "color: blue; font-weight: bold",
    "",
    "color: orange",
    "",
    "color: orange",
    ""
  );
}
