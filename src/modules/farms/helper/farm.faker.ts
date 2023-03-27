import {faker} from '@faker-js/faker';
import {Farm} from "../entities";


export function createRandomFarm(userId:string): Farm {
    return {
        id: faker.datatype.uuid(),
        address: faker.address.streetAddress(),
        coordinates: `${faker.address.latitude()},${faker.address.longitude()}`,
        name: `${faker.name.firstName()}`,
        size: faker.datatype.float(),
        userId: userId,
        yield: faker.datatype.float(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    }
}