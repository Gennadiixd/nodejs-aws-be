import "source-map-support/register";
import SNS from "aws-sdk/clients/sns";
import { ProductsRepository } from "../repository/products-repository";

const getProductsFromRecords = (records) => {
  return records.map((record) => JSON.parse(record.body));
};

export const catalogBatchProcess = (event) => {
  const productsRepository = new ProductsRepository();
  const sns = new SNS({ region: "eu-west-1" });

  const products = getProductsFromRecords(event.Records);

  productsRepository.createProducts(products).then(
    () => {
      sns.publish(
        {
          Subject: "new products created!",
          Message: JSON.stringify(products),
          TopicArn: process.env.SNS_ARN,
        },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    },
    (error) => {
      console.log(error);
    }
  );
};
