import app from './app';
import { Config } from './config/index';

const startServer = () => {
    const { PORT } = Config;
    try {
        // eslint-disable-next-line no-console
        app.listen(PORT, () => {
            console.log('listening on port ', Config.PORT);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        process.exit(1);
    }
};

startServer();
