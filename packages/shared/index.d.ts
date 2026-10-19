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
export declare const NUMERIC_PRODUCT_FIELDS: readonly ['sku', 'grams', 'stock', 'price', 'compare_price', 'barcode'];
export declare const PAGE_SIZE: number;
export declare const OTP_LENGTH: number;

export type ProductField = (typeof PRODUCT_FIELDS)[number];

/** A product as returned by the API. */
export interface Product {
  id: number;
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

/** `result` of GET /api/products. */
export interface PaginatedProducts {
  count: number;
  page: number;
  totalPages: number;
  next: string | null;
  prev: string | null;
  products: Product[];
}
