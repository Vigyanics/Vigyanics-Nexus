import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import adminRouter from "./admin";
import storeRouter from "./store";
import migrateRouter from "./migrate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(storeRouter);
router.use(adminRouter);
router.use(migrateRouter);

export default router;
