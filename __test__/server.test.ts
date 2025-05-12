import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createUsersServer } from '../src/server';

describe('CRUD-API tests', () => {
  let api = request(createUsersServer());

  beforeEach(() => {
    api = request(createUsersServer());
  });

  it('Full cycle from get all users,create one to delete user(only positive cases)', async () => {
    let userId = '';
    const responseGetAll = await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);

    const responsePost = await api.post('/api/users').send({
      username: 'Hanna',
      age: 29,
      hobbies: ['singing'],
    });

    expect(responsePost.status).toBe(201);
    expect(responsePost.body).toHaveProperty('id');
    expect(responsePost.body.username).toBe('Hanna');
    expect(responsePost.body.age).toBe(29);
    expect(responsePost.body.hobbies).toEqual(['singing']);

    userId = responsePost.body.id;

    const responseGetById = await api.get(`/api/users/${userId}`);

    expect(responseGetById.status).toBe(200);
    expect(responseGetById.body.id).toBe(userId);

    const responsePut = await api.put(`/api/users/${userId}`).send({
      age: 25,
    });

    expect(responsePut.status).toBe(200);
    expect(responsePut.body.username).toBe('Hanna');
    expect(responsePut.body.age).toBe(25);
    expect(responsePut.body.hobbies).toEqual(['singing']);

    const responseDelete = await api.delete(`/api/users/${userId}`);

    expect(responseDelete.status).toBe(204);

    await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);
  });

  it('Full cycle from get all users,create one to delete user, considering 400 errors', async () => {
    let userId = '';
    const responseGetAll = await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);

    const failedPostResponse = await api.post('/api/users').send({
      username: 10,
      age: '',
    });

    expect(failedPostResponse.status).toBe(400);

    const responsePost = await api.post('/api/users').send({
      username: 'Hanna',
      age: 29,
      hobbies: ['singing'],
    });

    expect(responsePost.status).toBe(201);
    expect(responsePost.body).toHaveProperty('id');
    expect(responsePost.body.username).toBe('Hanna');
    expect(responsePost.body.age).toBe(29);
    expect(responsePost.body.hobbies).toEqual(['singing']);

    userId = responsePost.body.id;

    const invalidGetOneResponse = await api.get('/api/users/invalid-uuid');

    expect(invalidGetOneResponse.status).toBe(400);

    const responseGetById = await api.get(`/api/users/${userId}`);

    expect(responseGetById.status).toBe(200);
    expect(responseGetById.body.id).toBe(userId);

    const responsePut = await api.put(`/api/users/${userId}`).send({
      age: 25,
    });

    expect(responsePut.status).toBe(200);
    expect(responsePut.body.username).toBe('Hanna');
    expect(responsePut.body.age).toBe(25);
    expect(responsePut.body.hobbies).toEqual(['singing']);

    const responseDelete = await api.delete(`/api/users/${userId}`);

    expect(responseDelete.status).toBe(204);

    await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);
  });

  it('Full cycle from get all users,create one to delete user, considering 404  errors', async () => {
    let userId = '';

    const invalidGetAllResponse = await api.get('/api/user');
    expect(invalidGetAllResponse.status).toBe(404);
    expect(invalidGetAllResponse.body).toEqual({ message: 'Endpoint not found' });

    const responseGetAll = await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);
    console.log(responseGetAll.body);

    const responsePost = await api.post('/api/users').send({
      username: 'Hanna',
      age: 29,
      hobbies: ['singing'],
    });

    expect(responsePost.status).toBe(201);
    expect(responsePost.body).toHaveProperty('id');
    expect(responsePost.body.username).toBe('Hanna');
    expect(responsePost.body.age).toBe(29);
    expect(responsePost.body.hobbies).toEqual(['singing']);

    userId = responsePost.body.id;

    const secondResponseGetAll = await api.get('/api/users');
    expect(secondResponseGetAll.status).toBe(200);
    expect(secondResponseGetAll.body).toEqual([
      {
        username: 'Hanna',
        age: 29,
        hobbies: ['singing'],
        id: userId,
      },
    ]);

    const responsePut = await api.put(`/api/users/${userId}`).send({
      username: 'Hunter',
    });

    expect(responsePut.status).toBe(200);
    expect(responsePut.body.username).toBe('Hunter');
    expect(responsePut.body.age).toBe(29);
    expect(responsePut.body.hobbies).toEqual(['singing']);

    const responseDelete = await api.delete(`/api/users/${userId}`);
    expect(responseDelete.status).toBe(204);

    await api.get('/api/users');
    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body).toEqual([]);

    const notFoundOneResponse = await api.get(`/api/users/${userId}`);
    expect(notFoundOneResponse.status).toBe(404);
  });
});
