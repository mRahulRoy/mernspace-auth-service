import { DataSource, Repository } from 'typeorm';
import { Tenant } from '../../src/entity/Tenants';

export const truncateTables = async (connection: DataSource) => {
    //getting alll the entites/modals
    const entites = connection.entityMetadatas;

    //looping all entites and deleting them one by one in each iteration.
    for (const entity of entites) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJwt = (token: string | null): boolean => {
    if (token === null) {
        return false;
    }
    const parts = token.split('.');
    if (parts.length != 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8');
        });
        return true;
    } catch (error) {
        return false;
    }
};

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: 'Test Tenant',
        address: 'Test Adresss',
    });
    return tenant;
};
