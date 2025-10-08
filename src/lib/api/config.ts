export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_BASE_URL_PROD
    : process.env.NEXT_PUBLIC_API_BASE_URL_DEV;

export const CLIENT_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CLIENT_URL_PROD
    : process.env.NEXT_PUBLIC_CLIENT_URL_DEV;