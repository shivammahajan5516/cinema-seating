const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = require('../server');

describe('User Auth Routes', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        password: 'testpass123',
        userType: 'user'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should not sign in with wrong credentials', async () => {
    const res = await request(app)
      .post('/signin')
      .send({
        username: 'testuser',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
