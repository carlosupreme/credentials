import { createPool, FieldPacket, Pool, RowDataPacket } from "mysql2/promise";
import credentials from "./config/MySQLCredentials";
import { injectable } from "inversify";

@injectable()
export class MySQLConnection {
  readonly pool: Pool;

  constructor() {
    this.pool = createPool(credentials());
  }

  async query<T extends RowDataPacket[]>(
    sql: string,
    values: any[]
  ): Promise<T> {
    return (await this.pool.query<T>(sql, values))[0];
  }

  async queryWithFields<T extends RowDataPacket[]>(
    sql: string,
    values: any[]
  ): Promise<[T, FieldPacket[]]> {
    return this.pool.query<T>(sql, values);
  }

  async beginTransaction(): Promise<void> {
    await (await this.getConnection()).beginTransaction();
  }

  async commit(): Promise<void> {
    await (await this.getConnection()).commit();
  }

  async rollback(): Promise<void> {
    await (await this.getConnection()).rollback();
  }

  async getConnection() {
    return await this.pool.getConnection();
  }
}
