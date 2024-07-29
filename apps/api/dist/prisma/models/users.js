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
exports.Gender = void 0;
exports.listUsers = listUsers;
const bcrypt_1 = require("bcrypt");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
function listUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            {
                accountActive: true,
                username: 'Bruce Wayne',
                email: 'brucewayne@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1990-01-01'),
                imgUrl: null,
            },
            {
                accountActive: true,
                username: 'Clark Kent',
                email: 'clarkkent@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1985-06-18'),
                imgUrl: null,
            },
            {
                accountActive: true,
                username: 'Diana Prince',
                email: 'dianaprince@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-zon123-', 10),
                gender: Gender.FEMALE,
                dob: new Date('1980-03-22'),
                imgUrl: null,
            },
            {
                accountActive: true,
                username: 'Barry Allen',
                email: 'barryallen@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1992-11-14'),
                imgUrl: null,
            },
            {
                accountActive: true,
                username: 'Arthur Curry',
                email: 'arthurcurry@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-ntis123-', 10),
                gender: Gender.MALE,
                dob: new Date('1983-01-29'),
                imgUrl: null,
            },
            {
                accountActive: true,
                username: 'Victor Stone',
                email: 'victorstone@example.com',
                password: yield (0, bcrypt_1.hash)('Mysql123-', 10),
                gender: Gender.MALE,
                dob: new Date('1995-06-29'),
                imgUrl: null,
            },
        ];
    });
}
