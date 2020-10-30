import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import {
  ProductsRepository,
  IProductsRepository,
} from "../repository/products-repository";
import { ProductEntity } from "../repository/entities";
import { Response, IProductResponse } from "./response";

export const getProductsList: APIGatewayProxyHandler = async (): Promise<
  IProductResponse
> => {
  let resp: IProductResponse;

  const productsRepository: IProductsRepository = new ProductsRepository();

  try {
    const productsList: Array<ProductEntity> = await productsRepository.getProductsList();
    resp = new Response({ body: productsList });
  } catch (error) {
    resp = new Response({ body: error, statusCode: 400 });
  }

  return resp;
};
