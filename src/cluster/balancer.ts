import cluster from 'cluster';
import os from 'os';
import http from 'http';
import { config } from 'dotenv';
import { createUsersServer } from '../server';
import { createProxy } from '../utils/proxy';

config();

const USERS_API_PORT = Number(process.env.PORT) || 3000;
const BALANCER_PORT = Number(process.env.BALANCER_PORT) || 4000;
const CPUS = os.availableParallelism?.() || os.cpus().length;
const MAX_WORKERS = CPUS - 1;

export const createBalancer = () => {
  const workersPorts: number[] = [];

  for (let i = 1; i <= MAX_WORKERS; i++) {
    const port = BALANCER_PORT + i;
    cluster.fork({ WORKER_PORT: port });
    workersPorts.push(port);
  }

  let counter = 0;

  const balancer = http.createServer((request, response) => {
    const targetPort = workersPorts[counter];
    counter = (counter + 1) % workersPorts.length;

    createProxy(
      targetPort,
      request,
      response,
      () =>
        console.log(
          `=>Balancer redirect request [${request.method}]:${request.url} to Worker ${targetPort}`,
        ),
      () =>
        console.log(
          `<=Balancer received response on [${request.method}]:${request.url} from Worker ${targetPort}`,
        ),
    );
  });

  balancer.listen(BALANCER_PORT, () => {
    console.log(`Load balancer listening on port ${BALANCER_PORT}`);
  });

  createUsersServer().listen(USERS_API_PORT, () => {
    console.log(`UserAPI listening on port ${USERS_API_PORT}`);
  });
};
