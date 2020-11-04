import { Context } from "aws-lambda/handler";
import { APIGatewayProxyEvent } from "aws-lambda";

import { getProductsList } from "../handler";
import { IProductResponse } from "../handlers/response";
import { productsList } from "../repository/db";

describe(`getProductsList`, () => {
  test(`Return list of products`, async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = () => {};

    const result: Promise<IProductResponse> | void = getProductsList(
      event,
      context,
      callback
    );

    if (!result) throw new Error('Lambda returned void');

    const { statusCode, body } = await result;

    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toEqual(productsList);
  });
});
