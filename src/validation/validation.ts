/**
 * Represents the result of a validation check.
 * @property valid - Whether the value is valid.
 * @property suggestion - A suggestion for a valid value.
 */
export type ValidationResult = {
  valid: boolean;
  suggestion: string;
};

/**
 * Represents a validation function for a value.
 * @template T - The type of the value to validate.
 */
export type Validation<T> = (value?: T | null) => ValidationResult;
