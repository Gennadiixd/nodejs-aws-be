import "source-map-support/register";
import S3 from "aws-sdk/clients/s3";
import csv from "csv-parser";

export const importFileParser = (event) => {
  const BUCKET_NAME = "app-78523-public";
  const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
  const { Records } = event;

  Records.forEach((record) => {
    const currentObjectKey = record.s3.object.key;

    s3.getObject({
      Bucket: BUCKET_NAME,
      Key: currentObjectKey,
    })
      .createReadStream()
      .pipe(csv())
      .on("data", (data) => {
        console.log(data);
      })
      .on("error", (error) => {
        console.log(error);
      })
      .on("end", async () => {
        await s3
          .copyObject({
            Bucket: BUCKET_NAME,
            CopySource: BUCKET_NAME + "/" + currentObjectKey,
            Key: currentObjectKey.replace("uploaded", "parsed"),
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: BUCKET_NAME,
            Key: currentObjectKey,
          })
          .promise();

        console.log("IN onEnd callback");
      });
  });
};
