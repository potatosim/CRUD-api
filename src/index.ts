import { createServer } from 'node:http';
import { config } from 'dotenv';

config();

const server = createServer();

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server successfully starts and listen port=${process.env.PORT}`);
});
