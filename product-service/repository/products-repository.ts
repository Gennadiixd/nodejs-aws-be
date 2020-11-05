import { Client } from "pg";

import { ProductEntity, ProductModel } from "./entities";
import { QueryBuilder, IQueryBuilder } from "./query-builder";
import { dbOptions } from "../db-config";
import { ICreateProductDTO } from "../DTO/create-product.dto";

export interface IProductsRepository {
  getProductsList: () => Promise<Array<ProductEntity>>;
  getProduct: (productId: string) => Promise<ProductEntity | undefined>;
  createProduct: (
    createProductDTO: ICreateProductDTO
  ) => Promise<{ createdProduct: ProductModel }>;
}

export class ProductsRepository implements IProductsRepository {
  client: Client;
  queryBuilder: IQueryBuilder;
  disconnectTimer: NodeJS.Timeout;
  isConnected: boolean;
  constructor() {
    this.client = new Client(dbOptions);
    this.queryBuilder = new QueryBuilder();

    this.disconnectTimer = null;
    this.isConnected = false;
  }

  private disconnect = () => {
    if (this.disconnectTimer) clearTimeout(this.disconnectTimer);
    this.disconnectTimer = setTimeout(() => {
      this.client.end(() => {
        this.disconnectTimer = null;
        this.isConnected = false;
        console.log("disconnected");
      });
    }, 1000);
  };

  private connect = async () => {
    if (this.isConnected) return;

    if (!this.disconnectTimer) {
      this.isConnected = true;
      await this.client.connect();
      console.log("connected");
    }
  };

  createProduct = async (
    createProductDTO: ICreateProductDTO
  ): Promise<{ createdProduct: ProductModel }> => {
    const { title, description, price, image, count } = createProductDTO;
    await this.connect();

    try {
      await this.client.query("BEGIN");
      const createProductQuery = this.queryBuilder.getCreateProductQuery(
        title,
        description,
        price,
        image
      );

      const {
        rows: [createdProduct],
      } = await this.client.query(createProductQuery);
      const { id } = createdProduct;

      await this.createStock(id, count);

      await this.client.query("COMMIT");
      console.log("TRANSACTION SUCCESS!");

      return createdProduct;
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw new Error("DAL createProduct error " + error.message);
    } finally {
      this.disconnect();
    }
  };

  private createStock = async (product_id: string, count: number) => {
    await this.connect();

    try {
      const createStockQuery = this.queryBuilder.getCreateStockQuery(
        product_id,
        count
      );
      const {
        rows: [createdStock],
      } = await this.client.query(createStockQuery);

      return createdStock;
    } catch (error) {
      throw new Error("DAL createStock error " + error.message);
    } finally {
      this.disconnect();
    }
  };

  getProductsList = async (): Promise<Array<ProductEntity>> => {
    await this.connect();

    try {
      const productsListQuery = this.queryBuilder.getProductsListQuery();
      const { rows: productsList } = await this.client.query(productsListQuery);
      return productsList;
    } catch (error) {
      throw new Error("DAL error " + error.message);
    } finally {
      this.disconnect();
    }
  };

  getProduct = async (
    productId: string
  ): Promise<ProductEntity | undefined> => {
    await this.connect();

    try {
      const productQuery = this.queryBuilder.getProductQuery(productId);
      const {
        rows: [product],
      } = await this.client.query(productQuery);

      return product;
    } catch (error) {
      throw new Error("DAL error " + error.message);
    } finally {
      this.disconnect();
    }
  };
}
