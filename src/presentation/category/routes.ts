import { Router } from 'express';
import { CategoryController } from './controller';
import { CategoryService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class CategoryRoutes {

    static get routes(): Router {

        const router = Router();

        const categoryService = new CategoryService();

        const controller = new CategoryController(categoryService);

        // Definir las rutas
        router.get('/', controller.getCategories);
        router.post('/', [AuthMiddleware.validateJWT], controller.createCategory);

        return router;
    }

}

