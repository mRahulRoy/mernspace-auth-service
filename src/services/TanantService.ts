import { Repository } from 'typeorm';
import { ITenants } from '../types';
import { Tenant } from '../entity/Tenants';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenants) {
        return await this.tenantRepository.save(tenantData);
    }
}
