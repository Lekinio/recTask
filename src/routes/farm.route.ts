import {RequestHandler, Router} from "express";
import {FarmController} from "../modules/farms/controllers/farm.controller";
import {verifyJwtToken} from "../middlewares/auth.middleware";


const router = Router();
const farmController = new FarmController();


router.get('/',[verifyJwtToken],farmController.getAll.bind(farmController) as RequestHandler);
router.post('/create',  farmController.create.bind(farmController) as RequestHandler);
router.post('/delete',  farmController.delete.bind(farmController) as RequestHandler);

export default router;