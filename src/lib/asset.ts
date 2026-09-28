/**
 * Base path for hosting under a sub-folder (e.g. GitHub Pages at
 * /Thanh-Van-Viet). Empty for a normal domain. Set at build time with
 * NEXT_PUBLIC_BASE_PATH — see README "GitHub Pages preview".
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a /public file path with the base path. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
