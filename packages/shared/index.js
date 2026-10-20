// Single source of truth for the product domain. The API uses these values to
// read requests and paginate, and the web app uses them to build its requests
// and forms, so both sides agree on field names and limits.
//
// Written as CommonJS so the API can require() it on any Node runtime (Vercel's
// can't require an ES module); Vite converts it for the web app.

// Fields a product can be created or updated with, named as the API expects them.
exports.PRODUCT_FIELDS = [
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
exports.NUMERIC_PRODUCT_FIELDS = ['sku', 'grams', 'stock', 'price', 'compare_price', 'barcode'];

exports.PAGE_SIZE = 10;

// Number of digits in the one-time code emailed to log in.
exports.OTP_LENGTH = 6;

// Seconds to wait before asking for another code for the same email.
exports.OTP_RESEND_SECONDS = 60;

// Shared account behind the "Try the demo" button. Its catalog resets daily.
exports.DEMO_EMAIL = 'demo@demos.hernanbaravalle.com';
