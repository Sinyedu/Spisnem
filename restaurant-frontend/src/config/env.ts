const DEFAULT_API_URL = "http://localhost:3000/api";

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
export const IS_PRODUCTION = import.meta.env.PROD;
