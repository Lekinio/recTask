import {SeedService} from "./seed.service";
import dataSource from "../orm/orm.config";

export const runSeed = async () => {
    const seedService = new SeedService();

    await dataSource.initialize();

    return seedService.seed();
}

runSeed();