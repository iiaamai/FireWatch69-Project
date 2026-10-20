import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDb, clearTestDb, closeTestDb } from './helpers/db.js';
import { createTestUser } from './helpers/factories.js';
import { ROLES, ACCOUNT_STATUS } from '../src/constants/roles.js';

before(async () => {
  await connectTestDb();
});

after(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.status, 'ok');
});

test('login with wrong password returns 401', async () => {
  await createTestUser({ email: 'a@example.com', password: 'Password123!' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'a@example.com', password: 'wrong-password' });
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('login with valid credentials returns a token', async () => {
  await createTestUser({ email: 'a@example.com', password: 'Password123!' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'a@example.com', password: 'Password123!' });
  assert.equal(res.status, 200);
  assert.ok(res.body.data.accessToken);
  assert.equal(res.body.data.user.email, 'a@example.com');
  assert.equal(res.body.data.user.passwordHash, undefined);
});

test('login validation rejects malformed email', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'not-an-email', password: 'x' });
  assert.equal(res.status, 400);
  assert.ok(Array.isArray(res.body.details));
});

test('login is blocked for non-active accounts', async () => {
  await createTestUser({
    email: 'suspended@example.com',
    password: 'Password123!',
    accountStatus: ACCOUNT_STATUS.SUSPENDED,
  });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'suspended@example.com', password: 'Password123!' });
  assert.equal(res.status, 403);
});

test('GET /auth/me without a token returns 401', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.equal(res.status, 401);
});

test('GET /auth/me with a valid token returns the user', async () => {
  await createTestUser({
    email: 'admin@example.com',
    password: 'Password123!',
    role: ROLES.SYSTEM_ADMIN,
  });
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'Password123!' });

  const res = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${login.body.data.accessToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.data.user.email, 'admin@example.com');
  assert.equal(res.body.data.user.role, ROLES.SYSTEM_ADMIN);
});

test('GET /auth/me with an invalid token returns 401', async () => {
  const res = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer not.a.real.token');
  assert.equal(res.status, 401);
});
