import { getProductPage } from "../data/productPages";

export default function ProductInfoLink({ code }: { code: string }) {
  const href = getProductPage(code);
  if (!href) return null;
  return <a href={href} onClick={(event) => event.stopPropagation()}
    aria-label={`اعرف أكثر عن المنتج ${code}`}
    className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-brand-500 bg-white px-3 py-2 text-sm font-extrabold text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600">
    اعرف أكثر عن المنتج
  </a>;
}
