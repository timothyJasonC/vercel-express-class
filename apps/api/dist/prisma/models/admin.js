"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAdmin = listAdmin;
const bcrypt_1 = require("bcrypt");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (Gender = {}));
var Role;
(function (Role) {
    Role["warAdm"] = "warAdm";
    Role["superAdm"] = "superAdm";
})(Role || (Role = {}));
function listAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            {
                role: Role.superAdm,
                accountActive: true,
                fullName: 'Jane Aid',
                email: 'janeaid@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.FEMALE,
                dob: new Date('1985-01-01'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'John Smith',
                email: 'johnsmith@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1990-02-02'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Tony Stark',
                email: 'tonystark@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1970-05-29'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Natasha Romanoff',
                email: 'natasharomanoff@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.FEMALE,
                dob: new Date('1984-11-22'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Steve Rogers',
                email: 'steverogers@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1918-07-04'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Bruce Banner',
                email: 'brucebanner@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1969-12-18'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Wanda Maximoff',
                email: 'wandamaximoff@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.FEMALE,
                dob: new Date('1989-05-10'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Peter Parker',
                email: 'peterparker@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1998-08-10'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Carol Danvers',
                email: 'caroldanvers@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.FEMALE,
                dob: new Date('1969-03-17'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'T Challa',
                email: 'tchalla@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1975-02-16'),
                createdAt: new Date(),
            },
            {
                role: Role.warAdm,
                accountActive: true,
                fullName: 'Scott Lang',
                email: 'scottlang@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1980-06-08'),
                createdAt: new Date(),
            },
        ];
    });
}
