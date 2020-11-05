export interface ICreateProductDTO {
  title: string;
  description: string;
  price: number;
  image: string;
  count: number;
}

export class CreateProductDTO implements ICreateProductDTO {
  title: string;
  description: string;
  price: number;
  image: string;
  count: number;
  constructor({ title, description, price, image, count }) {
    this.validate({ title, description, price, image, count });
    this.title = title;
    this.description = description;
    this.price = price;
    this.image = image;
    this.count = count;
  }

  checkTypeString = (param) => {
    return typeof param === "string";
  };

  checkTypeNumber = (param) => {
    return typeof param === "number";
  };

  getTypeErrorMessage = (param, type, arg) =>
    `Type error. Expected type ${type} but got ${typeof param} on ${arg} field`;

  validate = ({ title, description, price, image, count }) => {
    if (!this.checkTypeString(title)) {
      throw new Error(this.getTypeErrorMessage(title, "string", "title"));
    }

    if (!this.checkTypeString(description)) {
      throw new Error(
        this.getTypeErrorMessage(description, "string", "description")
      );
    }

    if (!this.checkTypeNumber(price)) {
      throw new Error(this.getTypeErrorMessage(price, "number", "price"));
    }

    if (!this.checkTypeString(image)) {
      throw new Error(this.getTypeErrorMessage(image, "string", "image"));
    }

    if (!this.checkTypeNumber(count)) {
      throw new Error(this.getTypeErrorMessage(count, "number", "count"));
    }
  };
}
