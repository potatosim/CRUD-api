import { ServerResponse } from 'node:http';
import { HttpCodes } from '../enums/HttpCodes';
import { stringify } from './json';

export const sendResponseData = (code: HttpCodes, data: unknown, response: ServerResponse) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(stringify(data));
};
