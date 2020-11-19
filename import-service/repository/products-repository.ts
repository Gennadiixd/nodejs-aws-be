import { Client } from "pg";
import { dbOptions } from "../db-config";
import { QueryBuilder } from "./query-builder";

export interface IProductsRepository {}

export class ProductsRepository implements IProductsRepository {
  client: Client;
  queryBuilder: any;
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

  createProducts = async (products) => {
    console.log(products);
    const createProductQuery = this.queryBuilder.getCreateProductQuery();
    const createStockQuery = this.queryBuilder.getCreateStockQuery();

    try {
      await this.connect();
      await this.client.query("BEGIN");

      products.forEach(async ({ title, description, price, image, count }) => {
        const {
          rows: [{ id }],
        } = await this.client.query<any>(createProductQuery, [
          title,
          description,
          price,
          image,
        ]);

        await this.client.query(createStockQuery, [id, count]);
      });

      await this.client.query("COMMIT");
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw new Error("DAL createProduct error " + error.message);
    } finally {
      this.disconnect();
    }
  };
}
