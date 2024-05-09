import { authController } from '../controller/auth.controller.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock User model
jest.mock('../models/user.model.js', () => ({
  findOne: jest.fn(),
  save: jest.fn(),
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller', () => {
  describe('signup', () => {
    it('should create a new user', async () => {
      // Mock request and response objects
      const req = {
        body: {
          username: 'testUser',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock bcrypt hashSync function
      bcryptjs.hashSync.mockReturnValue('hashedPassword');

      // Mock User model save function
      User.save.mockResolvedValue();

      // Call signup function
      await authController.signup(req, res);

      // Assert expectations
      expect(User.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith('new user added successfully');
    });

    it('should handle error when saving user fails', async () => {
      // Mock request and response objects
      const req = {
        body: {
          username: 'testUser',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock bcrypt hashSync function
      bcryptjs.hashSync.mockReturnValue('hashedPassword');

      // Mock User model save function to throw an error
      User.save.mockRejectedValue(new Error('Failed to save user'));

      // Call signup function
      await expect(authController.signup(req, res)).rejects.toThrow('Failed to save user');

      // Assert expectations
      expect(User.save).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Add similar test cases for login, google functions here
});
