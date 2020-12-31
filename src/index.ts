import {
  Column,
  createConnection,
  Entity,
  getManager,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}

(async () => {
  const conn = await createConnection({
    type: "mariadb",
    username: "root",
    password: "root",
    host: "localhost",
    port: 13306,
    database: "app",
    entities: [User],
    synchronize: true,
    // logging: true,
  });

  // await conn.createQueryBuilder().delete().from(User).execute();
  // const user1 = await getManager().save(User, new User("test"));
  const users = [new User("test"), new User("test")];
  await getManager().transaction((transactional) =>
    transactional
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .orUpdate({ conflict_target: ["id", "name"], overwrite: ["name"] })
      .values(users)
      .updateEntity(true)
      .execute()
  );

  console.log(users);

  console.log(await getManager().find(User));
})();
