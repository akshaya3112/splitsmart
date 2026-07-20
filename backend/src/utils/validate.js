import { Errors } from "./errors.js";

export function requireString(value, fieldName, { maxLength = 200, minLength = 1 } = {}) {
  if (typeof value !== "string" || value.trim().length < minLength) {
    throw Errors.badRequest(`"${fieldName}" is required and must be a non-empty string.`);
  }
  if (value.length > maxLength) {
    throw Errors.badRequest(`"${fieldName}" must be at most ${maxLength} characters.`);
  }
  return value.trim();
}

export function requirePositiveInt(value, fieldName) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw Errors.badRequest(`"${fieldName}" must be a positive integer (smallest currency unit, e.g. paise).`);
  }
  return n;
}

export function requireArray(value, fieldName, { minLength = 1 } = {}) {
  if (!Array.isArray(value) || value.length < minLength) {
    throw Errors.badRequest(`"${fieldName}" must be a non-empty array.`);
  }
  return value;
}

export function requireOneOf(value, fieldName, allowed) {
  if (!allowed.includes(value)) {
    throw Errors.badRequest(`"${fieldName}" must be one of: ${allowed.join(", ")}.`);
  }
  return value;
}
