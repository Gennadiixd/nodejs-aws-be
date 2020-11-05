import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import "source-map-support/register";

import {
  ProductsRepository,
  IProductsRepository,
} from "../repository/products-repository";
import { Response, IProductResponse } from "./response";
import { CreateProductDTO } from "../DTO/create-product.dto";
import { ProductModel } from "../repository/entities";

export const postProduct: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<IProductResponse> => {
  console.log("Incoming request.", event.body);
  let resp: IProductResponse;

  try {
    const productsRepository: IProductsRepository = new ProductsRepository();
    const createProductDTO = new CreateProductDTO(JSON.parse(event.body));

    const createdProduct: {
      createdProduct: ProductModel;
    } = await productsRepository.createProduct(createProductDTO);

    resp = new Response({ body: { createdProduct } });
  } catch (error) {
    resp = new Response({
      body: { error: error.message },
      statusCode: 400,
    });
  }

  return resp;
};
