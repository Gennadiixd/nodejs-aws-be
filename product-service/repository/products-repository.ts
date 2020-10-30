import { productsList } from "./db";
import { ProductEntity } from "./entities";

const getMockedProducts = (): Promise<Array<ProductEntity>> =>
  Promise.resolve(productsList);

export interface IProductsRepository {
  getProductsList: () => Promise<Array<ProductEntity>>;
  getProduct: (productId: number) => Promise<ProductEntity | undefined>;
}

export class ProductsRepository implements IProductsRepository {
  getProducts: () => Promise<Array<ProductEntity>>;
  constructor(getProducts = getMockedProducts) {
    this.getProducts = getProducts;
  }

  getProductsList = (): Promise<Array<ProductEntity>> => {
    const productsList: Promise<Array<ProductEntity>> = this.getProducts();
    return productsList;
  };

  getProduct = async (
    productId: number
  ): Promise<ProductEntity | undefined> => {
    const productsList: Array<ProductEntity> = await this.getProducts();
    const product: ProductEntity = productsList.find(
      (el) => el.id === productId
    );
    return product;
  };
}
