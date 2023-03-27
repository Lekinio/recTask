import {faker} from '@faker-js/faker';
import {User} from "../entities/user.entity";

export function createRandomUser(): User {
    return {
        id: faker.datatype.uuid(),
        address: faker.address.streetAddress(),
        coordinates: `${faker.address.latitude()},${faker.address.longitude()}`,
        email: faker.internet.email(),
        hashedPassword: faker.internet.password(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
}