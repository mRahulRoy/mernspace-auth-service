import express, { NextFunction, Request, Response } from 'express';
import { TenantController } from '../controllers/TenantController';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenants';
import { TenantService } from '../services/TanantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import tenantValidator from '../validators/tenant-validator';
import { CreateTenantRequest } from '../types';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

//Here we have first added the authenticate middleware and then we have passed a another middleware that checks if the current user is admin or not. becouse only admin are allowed to create tenants.
router
    .route('/')
    .post(
        authenticate,
        canAccess([Roles.ADMIN]),
        tenantValidator,
        (req: Request, res: Response, next: NextFunction) =>
            tenantController.create(req, res, next),
    );

router
    .route('/')
    .get((req, res, next) => tenantController.getAll(req, res, next));

router.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
);

router.get('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    tenantController.getOne(req, res, next),
);

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;
