import express from 'express';
import { TenantController } from '../controllers/TenantController';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenants';
import { TenantService } from '../services/TanantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router
    .route('/')
    .post(authenticate, (req, res, next) =>
        tenantController.create(req, res, next),
    );

export default router;
