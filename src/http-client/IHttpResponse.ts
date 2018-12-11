import http = require("http");

export interface IHttpResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
