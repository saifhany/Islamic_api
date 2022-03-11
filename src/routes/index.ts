import {Router} from 'express';
import usersRoutes from './api/users.routes';
import postsRoutes from './api/posts.routes';
import khatmaRoutes from './api/khatma.routes';

const routes = Router();

routes.use('/users',usersRoutes);
routes.use('/posts',postsRoutes);
routes.use('/khatmas',khatmaRoutes);

export default routes;