import UsersDB from './data/users';
import { createUsersServer } from './server';

const PORT = process.env.PORT || 3000;

createUsersServer(new UsersDB()).listen(PORT, () => {
  console.log(`Server successfully starts and listen port=${PORT}`);
});
