import { Context } from "aws-lambda/handler";
import { APIGatewayProxyEvent } from "aws-lambda";

import { getProduct } from "../handler";
import { IProductResponse } from "../handlers/response";

describe(`getProduct`, () => {
  test(`Return error if no pathParameters passed`, async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;
    const callback = () => {};

    const result: Promise<IProductResponse> | void = getProduct(
      event,
      context,
      callback
    );

    if (!result) throw new Error('Lambda returned void');

    const { statusCode, body } = await result;
    expect(statusCode).toBe(400);
    expect(body).toBe('{"error":"productId is missing or incorrect"}');
  });

  test(`Return correct product by id in pathParameters`, async () => {
    const event = ({
      pathParameters: {
        productId: "1",
      },
    } as unknown) as APIGatewayProxyEvent;

    const context = {} as Context;
    const callback = () => {};

    const result: Promise<IProductResponse> | void = getProduct(
      event,
      context,
      callback
    );

    if (!result) throw new Error('Lambda returned void');

    const { statusCode, body } = await result;
    expect(statusCode).toBe(200);
    expect(body).toBe(
      '{"title":"bulbasaur","image":"https://img.pokemondb.net/artwork/bulbasaur.jpg","id":1,"price":10,"count":4,"description":"A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokemon."}'
    );
  });
});
