// src/types/product.ts

// Główny produkt – DOPASUJ POLA do odpowiedzi z cakeapi/tw/index
export type Product = {
  jm1: string;
  s_t_elements: any;
  jmdod1: string;
  cn: any;
  sm: any;
  jm: string;
  kodpaskowy?: string;
  photos: any;
  id: number;
  nazwa: string; 
  kod: string;
  katalog: string;
  productphoto: { id: number; tw_id: number; photo_512: string; photo_256: string; photo_128: string; main_photo: number }[];
  // tu dodaj resztę pól, które zwraca twój backend
  // [key: string]: any; // możesz dodać fallback, jeśli chcesz
}

export type ProductCatalog = {
  tw: never[];
  kod: string;
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