import { Router } from "express";
import adminAuthRouter from "./auth";
import dashboardRouter from "./dashboard";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import customersRouter from "./customers";
import adminRequestsRouter from "./adminRequests";
import type { IRouter } from "express";

const router: IRouter = Router();

router.use(adminAuthRouter);
router.use(dashboardRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(customersRouter);
router.use(adminRequestsRouter);

export default router;
