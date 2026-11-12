import sql from './db';

export const createUser = async (email, password) => {
  const [user] = await sql`
    insert into auth_demo.users (email, password)
    values (${email}, ${password})
    returning id
  `;
  return user.id;
};

export const getUserByEmail = async (email) => {
  const [user] = await sql`
    select id, email, password from auth_demo.users where email = ${email}
  `;
  return user;
};
