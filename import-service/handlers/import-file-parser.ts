import "source-map-support/register";
import S3 from "aws-sdk/clients/s3";
import csv from "csv-parser";

export const importFileParser = (event) => {
  const BUCKET_NAME = "app-78523-public";
  const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
  const { Records } = event;

  Records.forEach((record) => {
    s3.getObject({
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    })
      .createReadStream()
      .pipe(csv())
      .on("data", (data) => {
        console.log(data);
      })
      .on("error", (data) => {
        console.log(data);
      })
      .on("end", () => {
        console.log("IN onEnd callback");
      });
  });
};
