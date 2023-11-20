import { Repository } from 'typeorm';
import { ITenant, ITenants } from '../types';
import { Tenant } from '../entity/Tenants';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenants) {
        return await this.tenantRepository.save(tenantData);
    }
    async getAll() {
        return await this.tenantRepository.find();
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
