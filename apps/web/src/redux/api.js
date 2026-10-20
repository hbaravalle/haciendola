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

// A 401 on a request made with a session means the session ended, usually
// because the 24-hour account was deleted. (Without one, it's a wrong login
// code, which the login form handles.)
async function baseQuery(args, api, extraOptions) {
  const hadSession = Boolean(api.getState().auth.token);
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && hadSession) {
    toast("Your session ended. Sign in again", { icon: "👋" });
    api.dispatch(logout());
  }
  return result;
}

// Every success wraps its payload in `result`.
const unwrapResult = (response) => response.result;

// The message the API sent with an error, or a fallback when there's none
// (the server couldn't be reached, or answered something that isn't JSON).
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

    // Every page is tagged with the whole list: any change can move products
    // between pages, so a create, edit or delete refetches the page on screen
    // and drops the others from the cache.
    getProducts: build.query({
      query: (page) => `/products?page=${page}`,
      transformResponse: unwrapResult,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    createProduct: build.mutation({
      query: (product) => ({ url: "/products", method: "POST", body: product }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    // `sku` addresses the product as it is now; `changes` may carry a new SKU.
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
