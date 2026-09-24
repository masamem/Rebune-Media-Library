/** Add a local published page here to enable its Learn more link automatically. */
export const PRODUCT_PAGES: Record<string, string> = {
  "RE-5-096": "/products/RE-5-096/index.html",
};
export function normalizeProductCode(code: string): string {
  return code.trim().toUpperCase().replace(/[–—]/g, "-").replace(/\s+/g, "");
}
export function getProductPage(code: string): string | undefined {
  return PRODUCT_PAGES[normalizeProductCode(code)];
}
