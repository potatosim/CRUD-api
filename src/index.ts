import { createUsersServer } from './server';

const USERS_API_PORT = process.env.PORT || 3000;

createUsersServer().listen(USERS_API_PORT, () => {
  console.log(`Server successfully starts and listen port=${USERS_API_PORT}`);
});
