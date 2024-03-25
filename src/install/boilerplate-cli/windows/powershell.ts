export async function addPathWindows(dir: string, scope: "U" | "S" = "U") {
  // Get current script's directory to locate the PowerShell script
  const currentDir = new URL(".", import.meta.url).pathname;
  const scriptPath = `${currentDir}/AddPath.ps1`.replace(/^\//, ""); // Remove leading slash for Windows paths

  // Spawn the PowerShell process
  const process = new Deno.Command("powershell.exe", {
    args: ["-ExecutionPolicy", "Bypass", "-File", scriptPath, dir, scope],
    stdout: "piped", // Capture standard output
    stderr: "piped", // Capture standard error
  });

  // Wait for the PowerShell script to complete
  const { code, stdout, stderr } = await process.output();

  // Decode the output and error to a string
  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);

  // Log the output and error (or handle them as needed)
  console.log(output);
  if (error) {
    console.error(error);
  }

  return code; // Return the exit code of the PowerShell process
}
