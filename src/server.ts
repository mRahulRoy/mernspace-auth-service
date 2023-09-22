import app from './app';
import { Config } from './config/index';
import logger from './config/logger';

const startServer = () => {
    const { PORT } = Config;
    try {
        // eslint-disable-next-line no-console
        // throw new Error("somet thing went wrong")
        app.listen(PORT, () => {
            logger.info(`Listening on port ${PORT}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();
