import { Router } from 'express';
import moduleRouter from './v1/moduleRouter';

const router = Router();

router.use('/v1', moduleRouter);

export default router;
