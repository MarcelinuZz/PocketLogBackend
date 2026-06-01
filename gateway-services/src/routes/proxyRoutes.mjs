import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/authMiddleware.mjs';

const AUTH_URL        = process.env.AUTH_SERVICE_URL        || 'http://localhost:3001';
const USER_URL        = process.env.USER_SERVICE_URL        || 'http://localhost:3002';
const WALLET_URL      = process.env.WALLET_SERVICE_URL      || 'http://localhost:3004';
const CATEGORY_URL    = process.env.CATEGORY_SERVICE_URL    || 'http://localhost:3005';
const TRANSACTION_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3006';
const REMINDER_URL    = process.env.REMINDER_SERVICE_URL    || 'http://localhost:3007';

export const setupProxies = (app) => {

    app.use('/public', createProxyMiddleware({
        target: AUTH_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/auth/logout', verifyToken, createProxyMiddleware({
        target: AUTH_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/auth', createProxyMiddleware({
        target: AUTH_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/users/settings', verifyToken, createProxyMiddleware({
        target: USER_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/users/change-settings', verifyToken, createProxyMiddleware({
        target: USER_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/users', verifyToken, createProxyMiddleware({
        target: AUTH_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/wallets', verifyToken, createProxyMiddleware({
        target: WALLET_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/categories', verifyToken, createProxyMiddleware({
        target: CATEGORY_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/transactions', verifyToken, createProxyMiddleware({
        target: TRANSACTION_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/reminders', verifyToken, createProxyMiddleware({
        target: REMINDER_URL,
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

};