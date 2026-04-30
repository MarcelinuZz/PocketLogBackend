// File: src/routes/proxyRoutes.mjs

import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/authMiddleware.mjs'; 

export const setupProxies = (app) => {
    app.use('/auth/logout', verifyToken, createProxyMiddleware({
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/auth', createProxyMiddleware({
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/users', verifyToken, createProxyMiddleware({
        target: 'http://localhost:3002',
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

    app.use('/wallets', verifyToken, createProxyMiddleware({
        target: 'http://localhost:3004',
        changeOrigin: true,
        pathRewrite: (path, req) => req.originalUrl
    }));

};