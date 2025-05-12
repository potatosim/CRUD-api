import { HttpMethods } from '../enums/HttpMethods';

export type Endpoint = {
  url: string;
  method: HttpMethods;
  match: (url: string) => boolean;
};

export type EndpointMap = Record<string, Endpoint>;
