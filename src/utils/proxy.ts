import http, { IncomingMessage, ServerResponse } from 'node:http';

export const createProxy = (
  targetPort: number,
  request: IncomingMessage,
  response: ServerResponse,
  beforeRedirect?: () => void,
  afterReceived?: () => void,
) => {
  const proxy = http.request(
    {
      hostname: 'localhost',
      port: targetPort,
      path: request.url,
      method: request.method,
      headers: request.headers,
    },
    (proxyResponse) => {
      afterReceived?.();
      response.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers);
      proxyResponse.pipe(response, { end: true });
    },
  );

  beforeRedirect?.();
  request.pipe(proxy, { end: true });
};
