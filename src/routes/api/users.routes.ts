import { Router } from 'express';
import * as controllers from '../../controllers/users.controllers';
import authenticationMiddleware from '../../middleware/authentication.middleware';
import userCreateValidator   from '../../validators/users';
import runValidation  from '../../validators/index';
import admin from '../../middleware/admin.middleware';

const routes = Router()
// api/users
// @ts-ignore
routes.route('/').post(userCreateValidator, runValidation ,controllers.create)
routes.route('/login').post(controllers.login)
routes.route('/').get(controllers.getMany)
routes.route('/userConnected').get(authenticationMiddleware,controllers.userConnected)
routes.route('/forget_password').post(controllers.forgetPassword)
routes.route('/reset_password').post(controllers.resetPassword)
routes.route('/d').patch(authenticationMiddleware,controllers.updateProfile)
routes.route('/role').patch(authenticationMiddleware,admin,controllers.updateRole)
routes.route('/update_page').patch(authenticationMiddleware,controllers.updatePage)
routes.route('/addcontacts').post(authenticationMiddleware,controllers.addcontacts)

export default routes