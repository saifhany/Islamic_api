import { Router } from 'express';
import * as controllers from '../../controllers/posts.controllers';
import authenticationMiddleware from '../../middleware/authentication.middleware';
import admin from '../../middleware/admin.middleware';

const routes = Router()
// api/users
routes.route('/').post(authenticationMiddleware,controllers.create)
routes.route('/').get(controllers.getMany)
routes.route('/:post_id').put(authenticationMiddleware,controllers.join)
routes.route('/submit/:post_id').put(authenticationMiddleware,controllers.submit)
routes.route('/done/:post_id').put(authenticationMiddleware,controllers.updatePost)
routes.route('/').delete(authenticationMiddleware,admin,controllers.deletePost)

export default routes