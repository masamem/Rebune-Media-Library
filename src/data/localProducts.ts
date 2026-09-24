import type { MediaFile } from "./media";
import { normalizeProductCode } from "./productPages";
export const LOCAL_PRODUCT_MEDIA: MediaFile[] = [
  {
    "id": "local-grill-food.jpg",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "المنتج مع الساندويتش",
    "fileType": "image",
    "extension": "jpg",
    "thumbnail": "/products/RE-5-096/assets/food.jpg",
    "previewUrl": "/products/RE-5-096/assets/food.jpg",
    "downloadUrl": "/products/RE-5-096/assets/food.jpg",
    "size": "458 KB"
  },
  {
    "id": "local-grill-closed.jpg",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "المنتج مغلق",
    "fileType": "image",
    "extension": "jpg",
    "thumbnail": "/products/RE-5-096/assets/closed.jpg",
    "previewUrl": "/products/RE-5-096/assets/closed.jpg",
    "downloadUrl": "/products/RE-5-096/assets/closed.jpg",
    "size": "220 KB"
  },
  {
    "id": "local-grill-open.jpg",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "المنتج مفتوح",
    "fileType": "image",
    "extension": "jpg",
    "thumbnail": "/products/RE-5-096/assets/open.jpg",
    "previewUrl": "/products/RE-5-096/assets/open.jpg",
    "downloadUrl": "/products/RE-5-096/assets/open.jpg",
    "size": "424 KB"
  },
  {
    "id": "local-grill-flat.jpg",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "فتح 180 درجة",
    "fileType": "image",
    "extension": "jpg",
    "thumbnail": "/products/RE-5-096/assets/flat.jpg",
    "previewUrl": "/products/RE-5-096/assets/flat.jpg",
    "downloadUrl": "/products/RE-5-096/assets/flat.jpg",
    "size": "505 KB"
  },
  {
    "id": "local-grill-box.jpg",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "عبوة المنتج",
    "fileType": "image",
    "extension": "jpg",
    "thumbnail": "/products/RE-5-096/assets/box.jpg",
    "previewUrl": "/products/RE-5-096/assets/box.jpg",
    "downloadUrl": "/products/RE-5-096/assets/box.jpg",
    "size": "357 KB"
  },
  {
    "id": "local-grill-manual.pdf",
    "productCode": "RE-5-096",
    "productName": "سخان الساندويتش والشواية ريبون",
    "category": "أجهزة المطبخ",
    "date": "2026-09-24",
    "fileName": "دليل الاستخدام",
    "fileType": "pdf",
    "extension": "pdf",
    "thumbnail": "/products/RE-5-096/assets/closed.jpg",
    "previewUrl": "/products/RE-5-096/assets/manual.pdf",
    "downloadUrl": "/products/RE-5-096/assets/manual.pdf",
    "size": "3336 KB"
  }
];
export function withLocalProducts(files: MediaFile[]): MediaFile[] {
const codes = new Set(files.map(file => normalizeProductCode(file.productCode)));
return [...files, ...LOCAL_PRODUCT_MEDIA.filter(file => !codes.has(file.productCode))];
}
