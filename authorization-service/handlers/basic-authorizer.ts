import "source-map-support/register";

const generatePolicy = (principalId, Resource, Effect = "Allow") => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect,
          Resource,
        },
      ],
    },
  };
};

const getCredits = (authorizationToken) => {
  const encodedCreds = authorizationToken.split(" ")[1];
  const buff = Buffer.from(encodedCreds, "base64");
  const plainCreds = buff.toString("utf-8").split(":");

  return {
    encodedCreds,
    plainCreds,
  };
};

const checkCredentials = (storedUserName, receivedPassword) => {
  const storedUserPassword = process.env[storedUserName];
  return storedUserPassword === receivedPassword;
};

export const basicAuthorizer = (event, _, callback) => {
  if (event["type"] != "TOKEN") {
    callback("Unauthorized");
    return;
  }

  try {
    const { authorizationToken } = event;

    const {
      encodedCreds,
      plainCreds: [username, password],
    } = getCredits(authorizationToken);

    console.log({ username, password });

    if (!password) {
      callback("Unauthorized");
      return;
    }

    const effect = checkCredentials(username, password) ? "Allow" : "Deny";
    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    console.log({ policy: JSON.stringify(policy) });

    callback(null, policy);
  } catch (error) {
    console.log({ error: error.message });
  }
};
