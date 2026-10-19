import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDb, clearTestDb, closeTestDb } from './helpers/db.js';
import { createTestUser } from './helpers/factories.js';
import { ROLES } from '../src/constants/roles.js';

before(async () => {
  await connectTestDb();
});

after(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

async function loginAs(overrides) {
  const { password } = await createTestUser(overrides);
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: overrides.email, password });
  return res.body.data.accessToken;
}

test('creating a user requires authentication', async () => {
  const res = await request(app)
    .post('/api/v1/users')
    .send({
      fullName: 'New User',
      email: 'new@example.com',
      password: 'Password123!',
      role: ROLES.RESPONDER,
    });
  assert.equal(res.status, 401);
});

test('a non-admin cannot create a user', async () => {
  const token = await loginAs({
    email: 'responder@example.com',
    role: ROLES.RESPONDER,
  });
  const res = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      fullName: 'New User',
      email: 'new@example.com',
      password: 'Password123!',
      role: ROLES.RESPONDER,
    });
  assert.equal(res.status, 403);
});

test('a system_admin can create a user', async () => {
  const token = await loginAs({
    email: 'admin@example.com',
    role: ROLES.SYSTEM_ADMIN,
  });
  const res = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      fullName: 'New Responder',
      email: 'responder@example.com',
      password: 'Password123!',
      role: ROLES.RESPONDER,
    });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.user.email, 'responder@example.com');
  assert.equal(res.body.data.user.role, ROLES.RESPONDER);
  assert.equal(res.body.data.user.passwordHash, undefined);
});

test('creating a duplicate email returns 409', async () => {
  const token = await loginAs({
    email: 'admin@example.com',
    role: ROLES.SYSTEM_ADMIN,
  });
  const payload = {
    fullName: 'Dup User',
    email: 'dup@example.com',
    password: 'Password123!',
    role: ROLES.RESPONDER,
  };
  const first = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  assert.equal(first.status, 201);

  const second = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);
  assert.equal(second.status, 409);
});

test('create user validation rejects a short password', async () => {
  const token = await loginAs({
    email: 'admin@example.com',
    role: ROLES.SYSTEM_ADMIN,
  });
  const res = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      fullName: 'Short Pw',
      email: 'short@example.com',
      password: '123',
      role: ROLES.RESPONDER,
    });
  assert.equal(res.status, 400);
});

test('an admin can list users', async () => {
  const token = await loginAs({
    email: 'admin@example.com',
    role: ROLES.SYSTEM_ADMIN,
  });
  const res = await request(app)
    .get('/api/v1/users')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data.users));
  assert.equal(res.body.data.users.length, 1);
});
