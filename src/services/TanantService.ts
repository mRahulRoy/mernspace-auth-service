import { Repository } from 'typeorm';
import { ITenant, ITenants, TenantQueryParams } from '../types';
import { Tenant } from '../entity/Tenants';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenants) {
        return await this.tenantRepository.save(tenantData);
    }
    async getAll(validatedQuery: TenantQueryParams) {
        const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('tenant.id', 'DESC')
            .getManyAndCount();
        return result;
    }
    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }
    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({ where: { id: tenantId } });
    }
    async deleteById(tenantId: number) {
        const tenant = await this.tenantRepository.findOne({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new Error('Tenant not found');
        }
        return await this.tenantRepository.delete(tenantId);
    }
}
