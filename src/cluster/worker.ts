import http from 'http';
import { config } from 'dotenv';
import { createProxy } from '../utils/proxy';

config();

const USERS_API_PORT = Number(process.env.PORT) || 3000;

export const createWorker = () => {
  const worker = http.createServer((request, response) => {
    createProxy(USERS_API_PORT, request, response);
  });

  worker.listen(process.env.WORKER_PORT, () => {
    console.log(`Worker listening on port ${process.env.WORKER_PORT}`);
  });
};
