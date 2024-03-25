// install.ts

enum OS {
  Darwin = "darwin",
  Linux = "linux",
  Windows = "windows",
}

enum Arch {
  AMD64 = "amd64",
  ARM64 = "arm64",
  I386 = "386",
}

type Platform = {
  os: OS;
  arch: Arch;
};

type PlatformKey = `${OS}/${Arch}`;

const SUPPORTED_PLATFORMS: Platform[] = [
  { os: OS.Darwin, arch: Arch.AMD64 },
  { os: OS.Darwin, arch: Arch.ARM64 },
  { os: OS.Linux, arch: Arch.I386 },
  { os: OS.Linux, arch: Arch.AMD64 },
  { os: OS.Linux, arch: Arch.ARM64 },
  { os: OS.Windows, arch: Arch.I386 },
  { os: OS.Windows, arch: Arch.AMD64 },
];

const BOILERPLATE_RELEASE_DOWNLOAD_URL =
  "https://github.com/gruntwork-io/boilerplate/releases/download";
const BOILERPLATE_CLI_VERSION = "v0.5.12";

const PLATFORM_DOWNLOAD_URLS = SUPPORTED_PLATFORMS.reduce(
  (acc, { os, arch }) => {
    const binaryName = `boilerplate_${os}_${arch}`;
    const binaryUrl = `${BOILERPLATE_RELEASE_DOWNLOAD_URL}/${BOILERPLATE_CLI_VERSION}/${binaryName}`;
    return { ...acc, [`${os}/${arch}`]: binaryUrl };
  },
  {} as Record<PlatformKey, string>
);

/**
 * Get the current platform based on the OS and arch of the Deno runtime.
 * @returns The current platform or undefined if the platform is not supported.
 */
function getCurrentPlatform(): Platform | null {
  // Get the OS and arch the current Deno CLI was built for
  const os = Deno.build.os;
  const arch = Deno.build.arch;

  // Mapping Deno's arch values to those expected in PlatformKey
  // Ignoring unsupported architectures
  const archMap: { [archDeno: string]: Arch } = {
    x86_64: Arch.AMD64,
    aarch64: Arch.ARM64,
  };

  // Mapping Deno's OS values to those expected in PlatformKey
  // Assuming unsupported OSes
  const osMap: { [osDeno: string]: OS } = {
    darwin: OS.Darwin,
    linux: OS.Linux,
    windows: OS.Windows,
  };

  if (!osMap[os] || !archMap[arch]) {
    return null;
  }

  return (
    SUPPORTED_PLATFORMS.find((supported) => {
      return supported.os === osMap[os] && supported.arch === archMap[arch];
    }) ?? null
  );
}

/**
 * Get Binary Name based on OS
 * @param platform
 * @returns The binary name for the platform.
 */
function getBinaryName(platform: Platform) {
  let binaryName = "boilerplate"; // Default binary name
  if (platform.os === OS.Windows) {
    binaryName += ".exe";
  }
}

async function downloadBinary(platform: Platform) {
  const binaryUrl = PLATFORM_DOWNLOAD_URLS[`${platform.os}/${platform.arch}`];

  const binaryName = getBinaryName(platform);
  const homePath = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
  const dirInstall = `${homePath}/.boilerplate`;
  const dirBinary = `${dirInstall}/bin`;
  const dirDownload = `${dirInstall}/download`;
  const fileDownload = `${dirDownload}/${binaryName}`;
  const fileInstall = `${dirBinary}/${binaryName}`;

  // Ensure the installation and cache directories exist
  await Deno.mkdir(dirBinary, { recursive: true });
  await Deno.mkdir(dirDownload, { recursive: true });

  // Download the binary
  console.log(`Downloading ${binaryUrl}...`);
  const response = await fetch(binaryUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${binaryUrl}: ${response.statusText}`);
  }
  const fileData = await response.arrayBuffer();
  await Deno.writeFile(fileDownload, new Uint8Array(fileData), { mode: 0o755 });

  // Move the binary to the installation directory
  await Deno.rename(fileDownload, fileInstall);
  console.log(`${binaryName} installed successfully to ${fileInstall}`);

  // Attempt to add binary to PATH for Mac, Linux, and Windows
  addDirToPath(platform, dirBinary);
}

function getCurrentShell(): string {
  const shell = Deno.env.get("SHELL");
  if (shell) {
    return shell;
  }
  return "";
}

function addDirToPath(platform: Platform, dir: string) {
  const shell = getCurrentShell();
  if (!shell) {
    // Give user instructions to add the directory to PATH
    console.log(
      `Could not determine the shell. Please add the following directory to your PATH: ${dir}`
    );
    return;
  } else {
    // Depending on the user's shell, platform, binary path dir, add the dir to PATH
    if (platform.os === OS.Windows) {
      // Determine if  it's dangerous to add the directory to PATH due to existing PATH length and its restrictions
      if (Deno.env.get("Path")?.length ?? 0 + dir.length > 2047) {
        console.log(
          `The PATH environment variable is too long. It may be dangerous to add '${dir}' to PATH.`
        );
        return;
      }
      // Add the directory to PATH for Windows
      // Use the `setx` command to set the PATH
      const setx = Deno.run({
        cmd: ["setx", "Path", `%Path%;${dir}`],
      });
      setx.close();
    } else {
      // Add the directory to PATH for Mac and Linux
      // Modify the shell configuration file to add the directory to PATH
      const shellConfig = {
        [OS.Darwin]: ".zshrc",
        [OS.Linux]: ".bashrc",
      };
      const config = shellConfig[platform.os];
      const shellPath = `${Deno.env.get("HOME")}/${config}`;
      const file = Deno.readTextFileSync(shellPath);
      if (!file.includes(dir)) {
        Deno.writeTextFileSync(
          shellPath,
          `${file}\nexport PATH=$PATH:${dir}\n`
        );
      }
    }
  }
}

/**
 * Check if the `boilerplate` CLI binary is installed.
 * @returns
 */
async function installBinary(platform: Platform) {
  const binaryUrl = PLATFORM_DOWNLOAD_URLS[`${platform.os}/${platform.arch}`];
  // install the binary to `/usr/local/bin/boilerplate`
  const installPath = "/usr/local/bin/boilerplate";
  const downloadPath = `/tmp/boilerplate_${platform.os}_${platform.arch}`;
  const downloadCmd = ["curl", "-L", "-o", downloadPath, binaryUrl];
  const makeExecutableCmd = ["chmod", "+x", downloadPath];
  const moveCmd = ["mv", downloadPath, installPath];
}

/**
 * Check if the `boilerplate` CLI binary is installed.
 * @returns Whether the binary is installed.
 */
async function checkBinary() {
  // Implement your logic here
  Deno.run({
    cmd: ["boilerplate", "--version"],
  });
}

/**
 * Check the version of the installed `boilerplate` CLI binary.
 * @returns The version of the installed binary.
 */
async function checkBinaryVersion() {
  // Implement your logic here
}

// Function to download and install the binary
/**
 * Download and install the `boilerplate` CLI binary.
 * @returns The path to the installed binary.
 * @throws If the binary could not be downloaded or installed.
 */
async function downloadAndInstallBinary() {
  // Determine the user's architecture
  // Download the binary for the architecture
  // Save and make it executable
}
