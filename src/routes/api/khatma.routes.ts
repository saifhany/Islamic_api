import { Router } from 'express';
import * as controllers from '../../controllers/khatma.controllers';
import authenticationMiddleware from '../../middleware/authentication.middleware';

const routes = Router()
// api/users
routes.route('/').post(authenticationMiddleware,controllers.create)
routes.route('/done/:khatma_id').put(authenticationMiddleware,controllers.updateKhatma)
routes.route('/').get(controllers.getMany)
export default routes