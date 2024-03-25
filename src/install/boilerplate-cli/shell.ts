import { addPathWindows } from "./windows/powershell.ts"; // Import the missing function
// This function adds a given directory to the PATH in the user's shell profile.
// It works by appending an export statement to the appropriate shell configuration file.
// For Windows, manual instructions are provided as a safer alternative.
async function addDirectoryToPath(dir: string) {
  // Determine the operating system
  const os = Deno.build.os;

  // Normalize the directory path
  const normalizedDir = dir.replace(/\\/g, "/");

  if (os === "windows") {
    await addPathWindows(normalizedDir);
  } else {
    // For Unix-like systems, determine the shell from the SHELL environment variable.
    const shellPath = Deno.env.get("SHELL") || "";
    let shellConfigFile = "";

    if (shellPath.includes("zsh")) {
      shellConfigFile = `${Deno.env.get("HOME")}/.zshrc`;
    } else if (shellPath.includes("bash")) {
      shellConfigFile = `${Deno.env.get("HOME")}/.bashrc`;
    } else if (shellPath.includes("fish")) {
      shellConfigFile = `${Deno.env.get("HOME")}/.config/fish/config.fish`;
    } // Add more conditions here for other shells

    if (shellConfigFile) {
      // Construct the line to add to the config file
      const exportLine =
        os === "linux" || os === "darwin"
          ? `export PATH="$PATH:${normalizedDir}"\n` // For bash/zsh
          : `set -gx PATH $PATH ${normalizedDir}\n`; // For fish

      // Append the export line to the shell's configuration file
      try {
        await Deno.writeTextFile(shellConfigFile, exportLine, { append: true });
        console.log(`Added ${dir} to PATH in ${shellConfigFile}`);
      } catch (error) {
        console.error(`Failed to update ${shellConfigFile}: ${error}`);
      }
    } else {
      console.log(
        "Shell not recognized or SHELL environment variable is not set."
      );
    }
  }
}
