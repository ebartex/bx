// src/types/product.ts

// Główny produkt – DOPASUJ POLA do odpowiedzi z cakeapi/tw/index
export type Product = {
  jm1: string;
  jmdod1: string;
  sm: any;
  jm: string;
  kodpaskowy?: string;
  photos: any;
  id: string;
  nazwa: string; 
  kod: string;
  katalog: string;
  xt: { id: number; kod: string }[];
  productphoto: { id: number; tw_id: number; photo_512: string; photo_256: string; photo_128: string; main_photo: number }[];
  zp: {
    data: string;
    id?: string;
  }[];
  cn?: { cena: string, cena1?: string, cena2?: string }[];  // Cena produktu
  s_t_elements?: STElement[];   
}
export type ProductClassification {
  ElementId: number;
  CDim_jm_Val: string;
  CDim_jm_shop: string;
  CDim_przeljmdod3: string;
}
export type STElement = {
  ElementId: string;
  Shortcut: string;
  product_classification: ProductClassification[]
}
export type ProductCatalog = {
  tw: never[];
  kod: string;
}

export type ProductPhoto = {
  main_photo: number;
  photo_512: string;
}
export type OrderHistory = {
  ilosc: number;
}
 export type ProductLastSale = {
  id: number,
  par: string
}

// Zbiorczy typ na "wszystko o produkcie"
export type ProductAll = {
  product: Product[];
  orderHistory: OrderHistory[];
  productLastSale: ProductLastSale[]; // Poprawiona definicja typu
}