import NeDB from 'nedb';
import bcrypt from 'bcryptjs';
import { User } from '../types';

const userDb = new NeDB({
    filename: 'data/users.db',
    autoload: true,
});

export const createUser = async (username: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        userDb.insert({ username, password: hashedPassword }, (err, newUser) => {
            if (err) reject(err);
            resolve(newUser as User);
        });
    });
};

export const findUserByUsername = (username: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        userDb.findOne({ username }, (err, user) => {
            if (err) reject(err);
            resolve(user as User | null);
        });
    });
};

export const findUserById = (id: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        userDb.findOne({ _id: id }, (err, user) => {
            if (err) reject(err);
            resolve(user as User | null);
        });
    });
};
