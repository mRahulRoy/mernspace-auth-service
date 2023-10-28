import app from './app';
import { AppDataSource } from './config/data-source';
import { Config } from './config/index';
import logger from './config/logger';

const startServer = async () => {
    const { PORT } = Config;
    try {
        await AppDataSource.initialize();
        logger.info('Connected to databse succesfully!');

        app.listen(PORT, () => {
            logger.info(`Listening on port ${PORT}`);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
