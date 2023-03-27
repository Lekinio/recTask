import {Farm} from "../entities";
import {Repository} from "typeorm";
import dataSource from "../../../orm/orm.config";
import {CreateFarmDto} from "../dto/create-farm.dto";
import {User} from "../../users/entities/user.entity";
import {UnprocessableEntityError} from "../../../errors/errors";
import {DeleteFarm, GetFarms} from "../interfaces/farm.interface";
import axios from 'axios';
import {DISTANCE_MATRIX} from "../../../config/endpoint";
import {UsersService} from "../../users/users.service";

export class FarmService {
    private readonly farmsRepository: Repository<Farm>
    private readonly usersService: UsersService;

    constructor() {
        this.farmsRepository = dataSource.getRepository(Farm);
        this.usersService = new UsersService();
    }

    public async getFarms(data: GetFarms) {
        const offset = data.offset ? data.offset : 0;
        const limit = data.limit ? data.limit : 20;
        const orderBy = data.orderBy.split(':');
        const outliers = data.outliers;

        const user = await this.usersService.findOneBy({id: data.user.id});

        const builder = await this.farmsRepository.createQueryBuilder('farm')
            .leftJoinAndSelect('farm.user', 'user')
            .select([
                'farm.name',
                'farm.address',
                'farm.coordinates',
                'farm.createdAt as createdAt',
                'farm.size',
                'farm.yield',
                'user.email'
            ])
            .offset(offset)
            .limit(limit);

        if (orderBy[0] === 'name' || orderBy === 'createdAt') {
            builder.orderBy(orderBy[0], orderBy[1]);
        }

        let farms = await builder.getMany();

        if(outliers){
            farms = await this.calculateOutliers(farms);
        }

        const results = await this.getDrivingDistance(farms, user?.coordinates);

        if (orderBy[0] === 'drivingDistance') {
            (orderBy[1] === 'desc') ?
                results.sort((a, b) => parseFloat(b.drivingDistance) - parseFloat(a.drivingDistance))
                :
                results.sort((a, b) => parseFloat(a.drivingDistance) - parseFloat(b.drivingDistance));
        }


        return results;
    }

    public async createFarm(farmData: CreateFarmDto, userId: string): Promise<any> {
        const {address} = farmData;

        const coordinates = await this.getCoordinatesWithAddress(address);

        const newFarm = await this.farmsRepository.create({...farmData, userId, coordinates});

        return this.farmsRepository.save(newFarm);
    }

    public async deleteFarm({farmId, userId}: DeleteFarm) {
        const farm = await this.farmsRepository.findOneBy({id: farmId, userId});

        if (!farm) {
            throw new UnprocessableEntityError(`farm with this id doesn't exists`);
        }

        return this.farmsRepository.delete(farm);
    }

    private async getDrivingDistance(farms: Farm[], userCoordinates?: string) {
        const farmsWithCoordinates = farms.map(async farm => {
            const drivingDistance = await axios.get(`${DISTANCE_MATRIX.endpoint}/distancematrix/json?origins=${farm.coordinates}&destinations=${userCoordinates}&key=${DISTANCE_MATRIX.token}`).then(x => x.data.rows[0].elements[0].distance.text);

            return {
                ...farm,
                drivingDistance
            }
        });
        return Promise.all(farmsWithCoordinates);
    }

    private async getCoordinatesWithAddress(address: string) {
        const {
            lat,
            lng
        } = await axios.get(`${DISTANCE_MATRIX.endpoint}/geocode/json?address=${address}&&key=${DISTANCE_MATRIX.token}`)
            .then(x => x.data.result[0].geometry.location)
            .catch(e => console.log(e));

        return `${lat}, ${lng}`;
    }

    private async calculateOutliers(farms: Farm[]) {
        const averageYield = Number((farms: Farm[]) => farms.reduce((total, farm) => total + farm.yield, 0) / farms.length);

        const yieldBelowAverage = 0.7 * averageYield;

        const yieldAboveAverage = 1.3 * averageYield;

        return farms.filter(farm => farm.yield < yieldAboveAverage || farm.yield > yieldBelowAverage)
    }
}