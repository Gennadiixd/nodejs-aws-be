export interface IProductResponse {
  statusCode: number;
  body: string;
  headers?: {
    [header: string]: boolean | number | string;
  };
}

export class Response implements IProductResponse {
  statusCode: number;
  body: string;
  headers?: {
    [header: string]: boolean | number | string;
  };

  constructor({ statusCode = 200, body = {} }) {
    this.statusCode = statusCode;
    this.body = JSON.stringify(body);
    this.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };
  }
}
