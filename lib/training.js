import sql from './db';

export async function getTrainings() {
  return sql`select id, title, image, description from auth_demo.trainings order by id`;
}
