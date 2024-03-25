// create.ts

import { CreateOptions } from "./src/create-cli.ts";
import { printErrorCreate, printInfoRunning } from "./src/create-cli.ts";
import { getArgsCreate, printHelpCreate } from "./src/create-cli.ts";

/**
 * Generate boilerplate files using the `boilerplate` CLI.
 * @throws If the boilerplate files could not be generated.
 */
function create(options: CreateOptions) {
  printInfoRunning(options);

  // Generate the boilerplate files
  console.info("Generating boilerplate files...");
}

// Main function to orchestrate the workflow
function main() {
  try {
    // Parse the CLI arguments
    const argv = getArgsCreate();
    if (argv.help) {
      printHelpCreate();
      Deno.exit(0);
    }

    // Generate boilerplate files
    create({ name: argv.name, type: argv.type });
  } catch (error) {
    printErrorCreate(error.message);
    printHelpCreate();
    Deno.exit(1);
  }
}

// Run the main function with necessary permissions
main();
