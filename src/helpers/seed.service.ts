import {Repository} from "typeorm";
import {Farm} from "../modules/farms/entities";
import dataSource from "../orm/orm.config";
import {User} from "../modules/users/entities/user.entity";
import {createRandomFarm} from "../modules/farms/helper/farm.faker";
import {createRandomUser} from "../modules/users/helper/user.faker";

export class SeedService {
    private readonly farmsRepository: Repository<Farm>
    private readonly usersRepository: Repository<User>;

    private userNumber = 4;
    private farmsNumber = 30;

    constructor() {
        this.farmsRepository = dataSource.getRepository(Farm);
        this.usersRepository = dataSource.getRepository(User);
    }

    async seed() {
        for (let i = 0; i < this.userNumber; i++) {
            const user = await createRandomUser();
            await this.SaveUser(user);
            await this.seedFarms(user.id)
        }
    }

    async seedFarms(userId: string) {
        const farms = [];
        for (let i = 0; i < this.farmsNumber; i++) {
            const randomFarms = await createRandomFarm(userId);
            farms.push(randomFarms);
        }
        await this.SaveFarms(farms);
    }

    async SaveFarms(farms: Farm[]) {
        return this.farmsRepository.createQueryBuilder().insert().values(farms).execute();
    }

    async SaveUser(user: User) {
        return this.usersRepository.createQueryBuilder().insert().values(user).execute()
    }
}