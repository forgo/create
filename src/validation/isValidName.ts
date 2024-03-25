import { Validation } from "./validation.ts";

/**
 * Validates an artifact name to ensure it is lower-kebab-case, starts with a letter, and is >= 3 characters.
 * @param name - The name to validate.
 * @returns The result of the validation check.
 */
export const isValidArtifactName: Validation<string> = (name) => {
  if (typeof name !== "string" || name === null || name === undefined) {
    return {
      suggestion: "must be a string and not null or undefined",
      valid: false,
    };
  }

  // >= 3 characters
  const ruleLength = /^.{3,}$/;

  // must only contain lowercase letters, numbers, and dashes
  const ruleAllowedChars = /^[a-z0-9-]+$/;

  // must not contain consecutive dashes
  const ruleNoConsecutiveDashes = /^(?!.*--).*$/;

  // must not end with a dash
  const ruleNoEndDash = /^[^-].*[^-]$/;

  // must start with a letter
  const ruleStartWithAlpha = /^[a-z]/;

  const valid =
    ruleLength.test(name) &&
    ruleAllowedChars.test(name) &&
    ruleNoConsecutiveDashes.test(name) &&
    ruleNoEndDash.test(name) &&
    ruleStartWithAlpha.test(name);

  return {
    suggestion:
      "must be lower-kebab-case, start with a letter, and be >= 3 characters",
    valid,
  };
};
