import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import {
  ProductsRepository,
  IProductsRepository,
} from "../repository/products-repository";
import { ProductEntity } from "../repository/entities";
import { Response, IProductResponse } from "./response";

export const getProduct: APIGatewayProxyHandler = async (
  event
): Promise<IProductResponse> => {
  console.log("Incoming request.", event.pathParameters);
  let resp: IProductResponse;

  const productsRepository: IProductsRepository = new ProductsRepository();
  const productId = event?.pathParameters?.productId;

  if (!productId) {
    resp = new Response({
      body: { error: "productId is missing or incorrect" },
      statusCode: 400,
    });
    return resp;
  }

  try {
    const product: ProductEntity = await productsRepository.getProduct(
      productId
    );

    resp = product
      ? new Response({ body: product })
      : new Response({ body: { error: "product not found" }, statusCode: 404 });
  } catch (error) {
    resp = new Response({ body: error, statusCode: 400 });
  }

  return resp;
};
