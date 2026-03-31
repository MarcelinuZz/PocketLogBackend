import express from 'express'

export default function CreateApps() {
    const app = express();
    app.use(express.json());

    return app;
}