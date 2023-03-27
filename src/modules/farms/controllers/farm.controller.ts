import {FarmService} from "../services/farm.service";
import {NextFunction, Request, Response} from "express";
import {CreateFarmDto} from "../dto/create-farm.dto";


export class FarmController {
    private readonly farmService: FarmService;

    constructor() {
        this.farmService = new FarmService();
    }

    public async getAll(req: Request, res: Response) {
        const {offset, limit, user, outliers} = req.body;
        const {orderBy} = req.query;

        const farms = await this.farmService.getFarms({offset, limit, user, orderBy, outliers});
        res.status(201).send(farms);
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const farm = await this.farmService.createFarm(req.body as CreateFarmDto, req.body.user.id);
            res.status(201).send(farm);
        } catch (error) {
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const userId = req.body.user.id;
        const {farmId} = req.body;
        try {
            const farm = await this.farmService.deleteFarm({farmId, userId});
            res.status(201).send(farm);
        } catch (error) {
            next(error);
        }
    }
}