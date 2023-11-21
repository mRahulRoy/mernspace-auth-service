import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/TanantService';
import { CreateTenantRequest } from '../types';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug('request for creating a tenant', req.body);
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info(`Tenant has been created `, { id: tenant.id });
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: CreateTenantRequest, res: Response, next: NextFunction) {
        this.logger.debug('request for getting all tenants');
        try {
            const tenants = await this.tenantService.getAll();
            this.logger.info(`Tenants has been fetched `);
            res.status(201).json({ tenants });
        } catch (error) {
            next(error);
        }
    }

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        const tenantId = req.params.id;

        //validating if the passed paramater in url is a valid interger or not.
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        this.logger.debug('Request for updating a tenant', req.body);

        try {
            await this.tenantService.update(Number(tenantId), {
                name,
                address,
            });

            this.logger.info('Tenant has been updated', { id: tenantId });

            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        //validating if the passed paramater in url is a valid interger or not.
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            const tenant = await this.tenantService.getById(Number(tenantId));

            if (!tenant) {
                next(createHttpError(400, 'Tenant does not exist.'));
                return;
            }

            this.logger.info('Tenant has been fetched');
            res.json(tenant);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            await this.tenantService.deleteById(Number(tenantId));

            this.logger.info('Tenant has been deleted', {
                id: Number(tenantId),
            });
            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }
}
