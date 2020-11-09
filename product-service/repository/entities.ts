export interface ProductEntity {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

export interface StockEntity {
  product_id: string;
  count: number;
}

export interface ProductModel {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  count: number;
}
