import express from 'express';
import { TenantController } from '../controllers/TenantController';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenants';
import { TenantService } from '../services/TanantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

//Here we have first added the authenticate middleware and then we have passed a another middleware that checks if the current user is admin or not. becouse only admin are allowed to create tenants.
router
    .route('/')
    .post(authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
        tenantController.create(req, res, next),
    );

router
    .route('/all')
    .get(authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
        tenantController.getTenants(req, res, next),
    );

export default router;
