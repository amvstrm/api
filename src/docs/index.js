import express from "express";
import swaggerUi from "swagger-ui-express";
import {swaggerData} from '../docs/swagger.js'

const router = express.Router();


router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerData, {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.2/swagger-ui.min.css'
}));

export default router;
