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

/** Product fields as the API stores them, after validation. */
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

/** A whole product, for creating one. Numbers may arrive as strings. */
export declare const productSchema: import('zod').ZodType<ProductInput>;
/** Some of a product's fields, for an update. */
export declare const productChangesSchema: import('zod').ZodType<Partial<ProductInput>>;
/** Why the compare-at price isn't valid for this product, or null. */
export declare function comparePriceIssue(product: Partial<ProductInput>): string | null;
/** Trimmed and lowercased. */
export declare const emailSchema: import('zod').ZodType<string>;
export declare const otpSchema: import('zod').ZodType<string>;
/** The first message for each field of a failed validation. */
export declare function errorsByField(error: import('zod').ZodError): Record<string, string>;

/** A product as returned by the API. */
export interface Product {
  id: number;
  /** Owner of the catalog the product belongs to. */
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

/** Every success response wraps its payload in `result`. */
export interface ApiSuccess<T> {
  status: number;
  result: T;
}

/** Every error response carries a readable `message`. */
export interface ApiError {
  status: number;
  message: string;
}

/** `result` of POST /api/auth/verify. */
export interface Session {
  token: string;
  email: string;
  /** When the account and its catalog are deleted. Null for the demo account. */
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
