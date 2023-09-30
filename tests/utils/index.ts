import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
    //getting alll the entites/modals
    const entites = connection.entityMetadatas;

    //looping all entites and deleting them one by one in each iteration.
    for (const entity of entites) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};
