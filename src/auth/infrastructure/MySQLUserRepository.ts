import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { RowDataPacket } from "mysql2";
import { injectable } from "inversify";
import { MySQLConnection } from "../../shared/infrastructure/MySQLConnection";
import { Mediator } from "mediatr-ts";
import { DomainEventBus } from "../../shared/infrastructure/PublishDomainEventsInterceptor";

interface UserMySQL extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  is_admin: boolean;
}

@injectable()
export class MySQLUserRepository
  extends DomainEventBus
  implements UserRepository
{
  constructor(readonly dbContext: MySQLConnection, mediator: Mediator) {
    super(mediator);
  }

  findByEmail = async (email: string): Promise<User | null> => {
    const sql =
      "SELECT id, email, password, is_admin FROM users WHERE email = ? LIMIT 1";

    const userMySQL = (
      await this.dbContext.query<UserMySQL[]>(sql, [email])
    )[0];

    if (!userMySQL) return null;

    return User.fromPrimitives({
      id: userMySQL.id,
      email: userMySQL.email,
      password: userMySQL.password,
      isAdmin: userMySQL.is_admin,
    });
  };

  add = async (user: User): Promise<void> => {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.insertUser(user),
        this.dbContext.commit(),
        this.publishEvents([user]),
      ]);
    } catch (error) {
      console.log({ error });
      await this.dbContext.rollback();
    }
  };

  private async insertUser(user: User) {
    await this.dbContext.query(
      "INSERT INTO users(id, is_admin, email, password) VALUES(?, ?, ?, ?)",
      [user.id.value, user.isAdmin, user.email.value, user.password.value]
    );
  }
}
