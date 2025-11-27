import { type User } from '../types';

interface UserRecord extends User {
    passwordHash?: string;
}

// Mock In-Memory Database
let dbUsers: { [email: string]: UserRecord } = {
    "test@example.com": {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        plan: 'Free',
        credits: 5,
        passwordHash: "password123"
    }
};

export const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userRecord = dbUsers[email.toLowerCase()];
            if (userRecord && userRecord.passwordHash === password) {
                const { passwordHash, ...user } = userRecord;
                resolve(user);
            } else {
                reject(new Error("Invalid email or password."));
            }
        }, 500);
    });
};

export const signup = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            if (dbUsers[lowercasedEmail]) {
                reject(new Error("An account with this email already exists."));
            } else if (password.length < 6) {
                reject(new Error("Password must be at least 6 characters long."))
            } else {
                const newId = (Object.keys(dbUsers).length + 2).toString();
                const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const newUser: UserRecord = {
                    id: newId,
                    email: lowercasedEmail,
                    name: name,
                    plan: 'Free',
                    credits: 5,
                    passwordHash: password
                };
                dbUsers[lowercasedEmail] = newUser;
                const { passwordHash, ...user } = newUser;
                resolve(user);
            }
        }, 500);
    });
};

export const upgradeUserPlan = (email: string, planName: 'Pro' | 'Business'): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            if (dbUsers[lowercasedEmail]) {
                dbUsers[lowercasedEmail].plan = planName;
                dbUsers[lowercasedEmail].credits = -1;
                resolve(dbUsers[lowercasedEmail]);
            } else {
                reject(new Error("User not found for upgrade."));
            }
        }, 300);
    });
};

export const updateUserName = (email: string, newName: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            if (dbUsers[lowercasedEmail]) {
                dbUsers[lowercasedEmail].name = newName;
                const { passwordHash, ...user } = dbUsers[lowercasedEmail];
                resolve(user);
            } else {
                reject(new Error("User not found."));
            }
        }, 400);
    });
};

export const deleteUser = (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lowercasedEmail = email.toLowerCase();
            if (dbUsers[lowercasedEmail]) {
                delete dbUsers[lowercasedEmail];
                resolve();
            } else {
                reject(new Error("User not found."));
            }
        }, 600);
    });
};