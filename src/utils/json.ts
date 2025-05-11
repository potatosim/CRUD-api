import { IncomingMessage, ServerResponse } from 'node:http';
import { sendResponseData } from './responseUtils';
import { HttpCodes } from '../enums/HttpCodes';

export const stringify = (data: unknown) => {
  return JSON.stringify(data, null, 2);
};

export const parseBody = async <T>(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<T | null> => {
  try {
    const body: T = await new Promise((resolve, reject) => {
      let data = '';
      request.on('data', (chunk) => {
        data += chunk;
      });

      request.on('end', () => {
        try {
          const parsedData = JSON.parse(data) as T;

          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    });

    return body;
  } catch {
    sendResponseData(HttpCodes.BadRequest, { message: 'Invalid JSON body' }, response);
    return null;
  }
};
