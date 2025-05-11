import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createUsersServer } from '../src/server';
import UsersDB from '../src/data/users';

describe('CRUD-API tests', () => {
  const api = request(createUsersServer(new UsersDB()));

  // To store created userId between tests
  let userId = '';

  it('should return 404 on non-existing-endpoint', async () => {
    const response = await api.get('/non-exiting-endpoint');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Endpoint not found' });
  });

  it('should return empty users array', async () => {
    const response = await api.get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 400 Bad Request on invalid data', async () => {
    const response = await api.post('/api/users').send({
      username: 10,
    });

    expect(response.status).toBe(400);
  });

  it('should create a user', async () => {
    const response = await api.post('/api/users').send({
      username: 'Alice',
      age: 30,
      hobbies: ['reading', 'gaming'],
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('Alice');
    expect(response.body.age).toBe(30);
    expect(response.body.hobbies).toEqual(['reading', 'gaming']);

    userId = response.body.id;
  });

  it('should return all users', async () => {
    const response = await api.get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return 400 on invalid userId', async () => {
    const response = await api.get('/api/users/invalid-uuid');

    expect(response.status).toBe(400);
  });

  it('should return 404 if userId not exist', async () => {
    const response = await api.get('/api/users/d20ac232-6c83-4439-9d7f-17b719eb094c');

    expect(response.status).toBe(404);
  });

  it('should return user by uid', async () => {
    const response = await api.get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });
});
