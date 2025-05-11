import cluster from 'cluster';
import { config } from 'dotenv';
import { createBalancer } from './cluster/balancer';
import { createWorker } from './cluster/worker';

config();

if (cluster.isPrimary) {
  createBalancer();
} else {
  createWorker();
}
