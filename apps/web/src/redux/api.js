import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { API_URL } from "../config.js";
import { logout } from "./authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// A 401 with a session means it ended (without one, it's a wrong login code).
async function baseQuery(args, api, extraOptions) {
  const hadSession = Boolean(api.getState().auth.token);
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && hadSession) {
    toast("Your session ended. Sign in again", { icon: "👋" });
    api.dispatch(logout());
  }
  return result;
}

// Success payloads come in `result`.
const unwrapResult = (response) => response.result;

// The API's error message, or a fallback (server down, non-JSON answer).
export function errorMessage(error, fallback = "Something went wrong. Try again") {
  if (error?.status === "FETCH_ERROR") return "Server error. Try again";
  return error?.data?.message ?? fallback;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Product"],
  endpoints: (build) => ({
    requestCode: build.mutation({
      query: (email) => ({ url: "/auth/otp", method: "POST", body: { email } }),
    }),
    verifyCode: build.mutation({
      query: ({ email, otp }) => ({ url: "/auth/verify", method: "POST", body: { email, otp } }),
      transformResponse: unwrapResult,
    }),
    startDemo: build.mutation({
      query: () => ({ url: "/auth/demo", method: "POST" }),
      transformResponse: unwrapResult,
    }),

    // One tag for every page: any change can shift products between pages.
    getProducts: build.query({
      query: (page) => `/products?page=${page}`,
      transformResponse: unwrapResult,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    createProduct: build.mutation({
      query: (product) => ({ url: "/products", method: "POST", body: product }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    // `sku` is the current one; `changes` may carry a new SKU.
    updateProduct: build.mutation({
      query: ({ sku, changes }) => ({ url: `/products/${sku}`, method: "PUT", body: changes }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    deleteProduct: build.mutation({
      query: (sku) => ({ url: `/products/${sku}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useRequestCodeMutation,
  useVerifyCodeMutation,
  useStartDemoMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = api;
