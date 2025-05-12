import http from 'http';
import { config } from 'dotenv';
import { createProxy } from '../utils/proxy';

config();

const DB_SERVICE_PORT = Number(process.env.DB_SERVICE_PORT) || 6379;

export const createWorker = () => {
  const worker = http.createServer((request, response) => {
    createProxy(DB_SERVICE_PORT, request, response);
  });

  worker.listen(process.env.WORKER_PORT, () => {
    console.log(`Worker listening on port ${process.env.WORKER_PORT}`);
  });
};
