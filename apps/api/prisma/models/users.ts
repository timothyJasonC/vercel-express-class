import { hash } from 'bcrypt';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export async function listUsers() {
    return [
        {
            accountActive: true,
            username: 'Bruce Wayne',
            email: 'brucewayne@example.com',
            password: await hash('Mysql123-', 10),
            gender: Gender.MALE,
            dob: new Date('1990-01-01'),
            imgUrl: null,
        },
        {
            accountActive: true,
            username: 'Clark Kent',
            email: 'clarkkent@example.com',
            password: await hash('Mysql123-', 10),
            gender: Gender.MALE,
            dob: new Date('1985-06-18'),
            imgUrl: null,
        },
        {
            accountActive: true,
            username: 'Diana Prince',
            email: 'dianaprince@example.com',
            password: await hash('Mysql123-zon123-', 10),
            gender: Gender.FEMALE,
            dob: new Date('1980-03-22'),
            imgUrl: null,
        },
        {
            accountActive: true,
            username: 'Barry Allen',
            email: 'barryallen@example.com',
            password: await hash('Mysql123-', 10),
            gender: Gender.MALE,
            dob: new Date('1992-11-14'),
            imgUrl: null,
        },
        {
            accountActive: true,
            username: 'Arthur Curry',
            email: 'arthurcurry@example.com',
            password: await hash('Mysql123-ntis123-', 10),
            gender: Gender.MALE,
            dob: new Date('1983-01-29'),
            imgUrl: null,
        },
        {
            accountActive: true,
            username: 'Victor Stone',
            email: 'victorstone@example.com',
            password: await hash('Mysql123-', 10),
            gender: Gender.MALE,
            dob: new Date('1995-06-29'),
            imgUrl: null,
        },
    ]
}
