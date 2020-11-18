import "source-map-support/register";
import S3 from "aws-sdk/clients/s3";
import { Response } from "./response";

export const importProductsFile = (event) => {
  const BUCKET_NAME = "app-78523-public";
  const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
  let resp;

  try {
    const { name: fileName } = event.queryStringParameters;
    const presignedURL = s3.getSignedUrl("putObject", {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      Expires: 60, //time to expire in seconds
      ContentType: "text/csv",
    });

    resp = new Response({ body: presignedURL });
  } catch (error) {
    resp = new Response({ body: error });
  }

  return resp;
};
