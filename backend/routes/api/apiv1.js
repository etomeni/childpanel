import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();

// Models

// Controllers
import { apiv1ctr } from '../../controllers/apiCtrl.js';

// middleWares


router.use(bodyParser.json());


// version 1 API :: v1
router.post(
    '/v1',
    apiv1ctr
);

export default router;