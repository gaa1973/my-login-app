import {JSONValue} from "./schema";
import "cross-fetch/polyfill";

export const sendGetRequest = async ({
  path,
  expectedStatusCode,
  params,
}: {
  path: string;
  expectedStatusCode: number;
  params?: Record<string, string>;
}) => {
  let url = `${process.env.API_URL}/${path.replace(/^\//, "")}`;

  if (params) {
    const queryParams = new URLSearchParams(params).toString();
    url += `?${queryParams}`;
  }

  const res = await fetch(url);

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};

export const sendPostRequest = async ({
  path,
  expectedStatusCode,
  body,
}: {
  path: string;
  expectedStatusCode: number;
  body?: JSONValue;
}) => {
  const res: Response = await fetch(`${process.env.API_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};

export const sendPatchRequest = async ({
  path,
  expectedStatusCode,
  body,
}: {
  path: string;
  expectedStatusCode: number;
  body?: JSONValue;
}) => {
  const res: Response = await fetch(`${process.env.API_URL}/${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};

export const sendDeleteRequest = async ({
  path,
  expectedStatusCode,
}: {
  path: string;
  expectedStatusCode: number;
}) => {
  const res: Response = await fetch(`${process.env.API_URL}/${path}`, {
    method: "DELETE",
  });

  if (res.status !== expectedStatusCode) {
    throw new Error(
      `statusCode must be ${expectedStatusCode}, but got ${res.status}`,
    );
  }

  return res;
};
