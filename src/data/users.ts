import { v4 as uuidv4 } from 'uuid';

type UserDto = {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

export type CreateUserDto = Omit<UserDto, 'id'>;
export type UpdateUserDto = Partial<Omit<UserDto, 'id'>>;

class UsersDB {
  private readonly usersMap: Map<string, UserDto>;

  constructor() {
    this.usersMap = new Map();
  }

  getUsers() {
    return Array.from(this.usersMap.values());
  }

  createUser(dto: CreateUserDto) {
    const { age, hobbies, username } = dto;
    const id = uuidv4();

    const newUser: UserDto = {
      age,
      hobbies,
      username,
      id,
    };

    this.usersMap.set(id, newUser);

    return newUser;
  }

  updateUser(dto: UpdateUserDto, uid: string): UserDto | undefined {
    const oldUser = this.usersMap.get(uid);

    if (oldUser) {
      const updatedUser: UserDto = {
        ...oldUser,
        age: dto.age ?? oldUser.age,
        username: dto.username ?? oldUser.username,
        hobbies: dto.hobbies ?? oldUser.hobbies,
      };

      this.usersMap.set(uid, updatedUser);

      return updatedUser;
    }

    return;
  }

  deleteUser(uid: string) {
    const user = this.usersMap.get(uid);

    if (user) {
      this.usersMap.delete(uid);

      return true;
    }

    return false;
  }

  getUserByUid(uid: string): UserDto | undefined {
    return this.usersMap.get(uid);
  }
}

export default UsersDB;
