export declare const PRODUCT_FIELDS: readonly [
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
export declare const PAGE_SIZE: number;
export declare const OTP_LENGTH: number;
export declare const OTP_RESEND_SECONDS: number;
export declare const DEMO_EMAIL: string;

export type ProductField = (typeof PRODUCT_FIELDS)[number];

/** Product fields after validation. */
export interface ProductInput {
  handle: string;
  title: string;
  description?: string | null;
  sku: number;
  grams?: number | null;
  stock?: number | null;
  price: number;
  compare_price?: number | null;
  barcode?: number | null;
}

/** For creating a product (numbers may be strings). */
export declare const productSchema: import('zod').ZodType<ProductInput>;
/** For updates: only the fields sent. */
export declare const productChangesSchema: import('zod').ZodType<Partial<ProductInput>>;
/** The compare-at price error, or null. */
export declare function comparePriceIssue(product: Partial<ProductInput>): string | null;
/** Trimmed and lowercased. */
export declare const emailSchema: import('zod').ZodType<string>;
export declare const otpSchema: import('zod').ZodType<string>;
/** First message per field. */
export declare function errorsByField(error: import('zod').ZodError): Record<string, string>;

/** A product as returned by the API. */
export interface Product {
  id: number;
  /** Catalog owner. */
  user_id: number;
  handle: string;
  title: string;
  description: string | null;
  sku: number;
  grams: number | null;
  stock: number | null;
  price: number;
  compare_price: number | null;
  barcode: number | null;
  enabled: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/** Success payloads come in `result`. */
export interface ApiSuccess<T> {
  status: number;
  result: T;
}

/** Errors carry a `message`. */
export interface ApiError {
  status: number;
  message: string;
}

/** `result` of POST /api/auth/verify. */
export interface Session {
  token: string;
  email: string;
  /** When the account is deleted; null for the demo. */
  accountExpiresAt: string | null;
}

/** `result` of GET /api/products. */
export interface PaginatedProducts {
  count: number;
  page: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
  products: Product[];
}
