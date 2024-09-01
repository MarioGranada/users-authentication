import db from './db';

export const createUser = async (email, password) => {
  const result = db
    .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
    .run(email, password);

  return result.lastInsertRowid;
};

export const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE  email = ?').get(email);
};
