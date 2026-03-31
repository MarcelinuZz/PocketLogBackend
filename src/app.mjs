import CreateApps from './createApps.mjs'
import 'dotenv/config';
import routes from "./routes/routes.mjs"

const app = CreateApps();
const PORT = process.env.PORT || 3000;

app.use(routes);

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})
