import http from 'node:http';
import { config } from 'dotenv';
import { EndpointMap } from './types/Endpoint';
import { HttpMethods } from './enums/HttpMethods';
import { parseBody } from './utils/json';
import UsersDB, { CreateUserDto, UpdateUserDto } from './data/users';
import { isUuid, validateCreateUserDto, validateUpdateUserDto } from './data/users.validations';
import { HttpCodes } from './enums/HttpCodes';
import { sendResponseData } from './utils/responseUtils';

export const createUsersServer = () => {
  config();

  const users = new UsersDB();

  const endpoints: EndpointMap = {
    getUsers: {
      url: '/api/users',
      method: HttpMethods.GET,
      match: (url) => /^\/api\/users\/?$/.test(url),
    },
    createUser: {
      url: '/api/users',
      method: HttpMethods.POST,
      match: (url) => /^\/api\/users\/?$/.test(url),
    },
    getUserByUid: {
      url: '/api/users/',
      method: HttpMethods.GET,
      match: (url) => /^\/api\/users\/[^/]+$/.test(url),
    },
    updateUserByUid: {
      url: '/api/users/',
      method: HttpMethods.PUT,
      match: (url) => /^\/api\/users\/[^/]+$/.test(url),
    },
    deleteUserByUid: {
      url: '/api/users/',
      method: HttpMethods.DELETE,
      match: (url) => /^\/api\/users\/[^/]+$/.test(url),
    },
  };

  return http.createServer(async (request, response) => {
    try {
      const { method, url } = request;

      if (!url || !method) {
        return;
      }

      const [, base, , id] = url.split('/');

      if (base !== 'api' || !Object.values(endpoints).some((endpoint) => endpoint.match(url))) {
        sendResponseData(HttpCodes.NotFound, { message: 'Endpoint not found' }, response);
        return;
      }

      const { getUsers, createUser, getUserByUid, updateUserByUid, deleteUserByUid } = endpoints;

      // GET ALL USERS
      if (method === getUsers.method && url === getUsers.url) {
        sendResponseData(HttpCodes.Success, users.getUsers(), response);
        return;
      }

      // CREATE USER
      if (method === createUser.method && url === createUser.url) {
        const body = await parseBody<CreateUserDto>(request, response);

        if (body) {
          const { message, success } = validateCreateUserDto(body);

          if (success) {
            const newUser = users.createUser(body);
            sendResponseData(HttpCodes.Created, newUser, response);
            return;
          }

          sendResponseData(HttpCodes.BadRequest, { message }, response);
          return;
        }

        return;
      }

      // GET USER BY UID
      if (method === getUserByUid.method && url.startsWith(getUserByUid.url)) {
        if (!isUuid(id)) {
          sendResponseData(
            HttpCodes.BadRequest,
            { message: `Invalid userId format, should be a uuid. Provided userId=${id}` },
            response,
          );
          return;
        }

        const user = users.getUserByUid(id);

        if (user) {
          sendResponseData(HttpCodes.Success, user, response);
          return;
        }

        sendResponseData(
          HttpCodes.NotFound,
          { message: `User with id = ${id} is not found!` },
          response,
        );
        return;
      }

      // UPDATE USER BY UID
      if (method === updateUserByUid.method && url.startsWith(updateUserByUid.url)) {
        if (!isUuid(id)) {
          sendResponseData(
            HttpCodes.BadRequest,
            { message: `Invalid userId format, should be a uuid. Provided userId=${id}` },
            response,
          );
          return;
        }

        const body = await parseBody<UpdateUserDto>(request, response);

        if (body) {
          const { message, success } = validateUpdateUserDto(body);

          if (success) {
            const updatedUser = users.updateUser(body, id);

            if (updatedUser) {
              sendResponseData(HttpCodes.Success, updatedUser, response);
              return;
            }

            sendResponseData(
              HttpCodes.NotFound,
              { message: `User with id = ${id} is not found!` },
              response,
            );
            return;
          }

          sendResponseData(HttpCodes.BadRequest, { message }, response);
          return;
        }

        return;
      }

      // DELETE USER BY UID
      if (method === deleteUserByUid.method && url.startsWith(deleteUserByUid.url)) {
        if (!isUuid(id)) {
          sendResponseData(
            HttpCodes.BadRequest,
            { message: `Invalid userId format, should be a uuid. Provided userId=${id}` },
            response,
          );
          return;
        }

        const deleteResult = users.deleteUser(id);

        if (deleteResult) {
          sendResponseData(HttpCodes.NoContent, null, response);
          return;
        }

        sendResponseData(
          HttpCodes.NotFound,
          { message: `User with id = ${id} is not found!` },
          response,
        );
        return;
      }
    } catch (error) {
      sendResponseData(
        HttpCodes.InternalServerError,
        { message: 'Internal Server Error', error: String(error) },
        response,
      );
      return;
    }
  });
};
