import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services";
import { FileUploadMiddleware, TypeMiddleware } from "../middlewares";


export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new FileUploadController(
            new FileUploadService()
        );

        router.use(FileUploadMiddleware.containFiles);
        // router.use(TypeMiddleware.validTypes(['users', 'products', 'categories'])); // No puede obtener datos del req porque no sabe cuál está ejecutando

        // Definir las rutas
        // api/upload/single/<user|category|product>/
        // api/upload/multiple/<user|category|product>/
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', [TypeMiddleware.validTypes(['users', 'products', 'categories'])], controller.uploadMultipleFiles);

        return router;
    }
}