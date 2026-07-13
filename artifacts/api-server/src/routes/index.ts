import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import adminRouter from "./admin";
import storeRouter from "./store";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(storeRouter);
router.use(adminRouter);

export default router;
