export enum OS {
  Darwin = "darwin",
  Linux = "linux",
  Windows = "windows",
}

export enum Arch {
  AMD64 = "amd64",
  ARM64 = "arm64",
  I386 = "386",
}

export type Platform = {
  os: OS;
  arch: Arch;
};

export type PlatformKey = `${OS}/${Arch}`;

export const SUPPORTED_PLATFORMS: Platform[] = [
  { os: OS.Darwin, arch: Arch.AMD64 },
  { os: OS.Darwin, arch: Arch.ARM64 },
  { os: OS.Linux, arch: Arch.I386 },
  { os: OS.Linux, arch: Arch.AMD64 },
  { os: OS.Linux, arch: Arch.ARM64 },
  { os: OS.Windows, arch: Arch.I386 },
  { os: OS.Windows, arch: Arch.AMD64 },
];

export const BOILERPLATE_RELEASE_DOWNLOAD_URL =
  "https://github.com/gruntwork-io/boilerplate/releases/download";
export const BOILERPLATE_CLI_VERSION = "v0.5.12";
