import { DataSource } from 'typeorm';

export const seedDatabase = async (
  dataSource: DataSource,
  input: Record<string, any[]>,
) => {
  await dataSource.transaction(async (manager) => {
    await manager.query("SET session_replication_role = 'replica';");

    for (const [entityName, values] of Object.entries(input)) {
      if (!values.length) continue;

      const repository = manager.getRepository(entityName);

      await repository.save(values).catch((err) => {
        console.error(`Error seeding ${entityName}:`, err.message);
        throw err;
      });
    }

    await manager.query("SET session_replication_role = 'origin';");
  });
};
