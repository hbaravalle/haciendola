// Shared by the API and the web app, so both agree on fields and limits.

import { z } from 'zod';

// Fields a product can be created or updated with.
export const PRODUCT_FIELDS = [
  'handle',
  'title',
  'description',
  'sku',
  'grams',
  'stock',
  'price',
  'compare_price',
  'barcode',
];

export const PAGE_SIZE = 10;

// Digits in the login code.
export const OTP_LENGTH = 6;

// Seconds before another code can be requested.
export const OTP_RESEND_SECONDS = 60;

// Account behind "Try the demo".
export const DEMO_EMAIL = 'demo@demos.hernanbaravalle.com';

// ─── Validation ─────────────────────────────────────────────────────────────

// Postgres INTEGER limit, for amounts.
const INTEGER_MAX = 2147483647;

// Form strings become numbers and "" becomes null; missing stays missing.
function toNumber(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : Number(trimmed);
}

function numberField(label, { min, max, required = false }) {
  const number = z
    .number({
      error: (issue) => (issue.input == null ? `${label} is required` : `${label} must be a number`),
    })
    .int({ error: `${label} must be a whole number` })
    .min(min, { error: min === 0 ? `${label} can't be negative` : `${label} must be at least ${min}` })
    .max(max, { error: `${label} is too large` });
  return z.preprocess(toNumber, required ? number : number.nullable().optional());
}

function textField(label, max) {
  return z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, { error: `${label} is required` })
    .max(max, { error: `${label} can't be longer than ${max} characters` });
}

const productFields = z.object({
  handle: textField('Handle', 255).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    error: 'Handle can only have lowercase letters, numbers and single dashes',
  }),
  title: textField('Title', 255),
  description: z.preprocess(
    (value) => (value === '' ? null : value),
    z
      .string({ error: 'Description must be text' })
      .max(20000, { error: "Description can't be longer than 20000 characters" })
      .nullable()
      .optional()
  ),
  sku: numberField('SKU', { min: 1, max: Number.MAX_SAFE_INTEGER, required: true }),
  grams: numberField('Weight', { min: 0, max: INTEGER_MAX }),
  stock: numberField('Stock', { min: 0, max: INTEGER_MAX }),
  price: numberField('Price', { min: 0, max: INTEGER_MAX, required: true }),
  compare_price: numberField('Compare-at price', { min: 0, max: INTEGER_MAX }),
  barcode: numberField('Barcode', { min: 1, max: Number.MAX_SAFE_INTEGER }),
});

// The compare-at price must be above the price. Returns the error or null.
export function comparePriceIssue(product) {
  if (product.compare_price == null || product.price == null) return null;
  return product.compare_price > product.price
    ? null
    : 'Compare-at price must be higher than the price';
}

// For creating a product.
export const productSchema = productFields.superRefine((product, ctx) => {
  const message = comparePriceIssue(product);
  if (message) ctx.addIssue({ code: 'custom', path: ['compare_price'], message });
});

// For updates: only the fields sent. The API checks the compare-at price apart.
export const productChangesSchema = productFields.partial();

// Trimmed and lowercased.
export const emailSchema = z
  .string({ error: 'Enter a valid email' })
  .trim()
  .toLowerCase()
  .max(254, { error: 'Enter a valid email' })
  .pipe(z.email({ error: 'Enter a valid email' }));

export const otpSchema = z
  .string({ error: `Enter the ${OTP_LENGTH}-digit code` })
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), { error: `Enter the ${OTP_LENGTH}-digit code` });

// First message per field, e.g. { price: 'Price is required' }.
export function errorsByField(error) {
  const errors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] ?? '';
    errors[field] ??= issue.message;
  }
  return errors;
}
