// Single source of truth for the product domain. The API uses these values to
// read requests and paginate, and the web app uses them to build its requests
// and forms, so both sides agree on field names and limits.

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

// Fields stored as numbers; forms send them as strings.
export const NUMERIC_PRODUCT_FIELDS = ['sku', 'grams', 'stock', 'price', 'compare_price', 'barcode'];

export const PAGE_SIZE = 10;

// Number of digits in the one-time code emailed to log in.
export const OTP_LENGTH = 6;

// Seconds to wait before asking for another code for the same email.
export const OTP_RESEND_SECONDS = 60;

// Shared account behind the "Try the demo" button. Its catalog resets daily.
export const DEMO_EMAIL = 'demo@demos.hernanbaravalle.com';
