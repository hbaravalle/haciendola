// Single source of truth for the product domain. The API uses these values to
// read requests and paginate, and the web app uses them to build its requests
// and forms, so both sides agree on field names and limits.

import { z } from 'zod';

// Fields a product can be created or updated with, named as the API expects them.
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

// Number of digits in the one-time code emailed to log in.
export const OTP_LENGTH = 6;

// Seconds to wait before asking for another code for the same email.
export const OTP_RESEND_SECONDS = 60;

// Shared account behind the "Try the demo" button. Its catalog goes back to the
// seed products when the demo is opened 24 hours after the last reset.
export const DEMO_EMAIL = 'demo@demos.hernanbaravalle.com';

// ─── Validation ─────────────────────────────────────────────────────────────
// The API validates every request with these schemas, and the web app checks
// its forms with the same ones before sending, so both give the same answer.

// Largest values the database columns hold: Postgres INTEGER for amounts, and
// BIGINT for SKUs and barcodes, which stay below what a JS number keeps exact.
const INTEGER_MAX = 2147483647;

// Forms send numbers as strings and leave optional ones empty. An empty value
// becomes null and any other string is read as a number; a missing value stays
// missing, so an update only touches the fields it sends.
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

// The compare-at price is the old price shown crossed out, so it has to be
// higher than the price. Returns the problem, or null when there's none.
export function comparePriceIssue(product) {
  if (product.compare_price == null || product.price == null) return null;
  return product.compare_price > product.price
    ? null
    : 'Compare-at price must be higher than the price';
}

// A whole product: what creating one needs.
export const productSchema = productFields.superRefine((product, ctx) => {
  const message = comparePriceIssue(product);
  if (message) ctx.addIssue({ code: 'custom', path: ['compare_price'], message });
});

// Some of a product's fields, for an update. Only the fields sent are checked,
// so an edit never fails over one it didn't touch; the compare-at price depends
// on the price too, so the API checks it on the product as it will be saved.
export const productChangesSchema = productFields.partial();

// Emails are compared lowercased and without surrounding spaces.
export const emailSchema = z
  .string({ error: 'Enter a valid email' })
  .trim()
  .toLowerCase()
  .max(254, { error: 'Enter a valid email' })
  .pipe(z.email({ error: 'Enter a valid email' }));

export const otpSchema = z
  .string({ error: `Enter the ${OTP_LENGTH}-digit code` })
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), { error: `Enter the ${OTP_LENGTH}-digit code` });

// The first message for each field of a failed validation, e.g.
// { price: 'Price is required' }, to show next to each form field.
export function errorsByField(error) {
  const errors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] ?? '';
    errors[field] ??= issue.message;
  }
  return errors;
}
