import { injectable } from "inversify";
import { DomainEventBus } from "../../../shared/infrastructure/PublishDomainEventsInterceptor";
import { MySQLConnection } from "../../../shared/infrastructure/MySQLConnection";
import { Mediator } from "mediatr-ts";
import { SeasonRepository } from "../../domain/league/SeasonRepository";
import { League } from "../../domain/league/League";
import { SeasonId } from "../../domain/league/SeasonId";
import { RowDataPacket } from "mysql2";
import { MatchId } from "../../domain/match/MatchId";
import { TeamId } from "../../domain/team/TeamId";

interface SeasonMySQL extends RowDataPacket {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
}

@injectable()
export class MySQLSeasonRepository
  extends DomainEventBus
  implements SeasonRepository
{
  constructor(readonly dbContext: MySQLConnection, mediator: Mediator) {
    super(mediator);
  }

  async all(): Promise<League[]> {
    const sql = `SELECT id, name, start_date, end_date FROM seasons;`;

    const seasonsMySQL = await this.dbContext.query<SeasonMySQL[]>(sql, []);

    if (!seasonsMySQL) return [];

    const seasons: League[] = [];

    for (const seasonMySQL of seasonsMySQL) {
      seasons.push(
        new League(
          new SeasonId(seasonMySQL.id),
          (await this.getMatches(seasonMySQL.id)).map((id) => new MatchId(id)),
          (await this.getTeams(seasonMySQL.id)).map((id) => new TeamId(id)),
          seasonMySQL.name,
          seasonMySQL.start_date,
          seasonMySQL.end_date
        )
      );
    }

    return seasons;
  }

  async add(season: League): Promise<void> {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.insertSeason(season),
        this.dbContext.commit(),
        this.publishEvents([season]),
      ]);
    } catch (error) {
      console.log({
        seasonMYSQLERROR: error,
      });

      await this.dbContext.rollback();
    }
  }

  private async insertSeason(season: League) {
    await this.dbContext.query(
      "INSERT INTO seasons(id, name, start_date, end_date) VALUES(?, ?, ?, ?)",
      [season.id.value, season.name, season.startDate, season.endDate]
    );
  }

  async findById(id: SeasonId): Promise<League | null> {
    return await this.findOneBy("id", id.value);
  }

  async findByName(name: string): Promise<League | null> {
    return await this.findOneBy("name", name);
  }

  private async findOneBy(by: string, value: string): Promise<League | null> {
    const sql = `SELECT id, name, start_date, end_date FROM seasons WHERE ${by} = ? LIMIT 1`;

    const seasonMySQL = (
      await this.dbContext.query<SeasonMySQL[]>(sql, [value])
    )[0];

    if (!seasonMySQL) return null;

    return new League(
      new SeasonId(seasonMySQL.id),
      (await this.getMatches(seasonMySQL.id)).map((id) => new MatchId(id)),
      (await this.getTeams(seasonMySQL.id)).map((id) => new TeamId(id)),
      seasonMySQL.name,
      seasonMySQL.start_date,
      seasonMySQL.end_date
    );
  }

  private async getMatches(seasonId: string): Promise<string[]> {
    const sql = "SELECT id from matches WHERE season_id = ?";
    const ids = await this.dbContext.query(sql, [seasonId]);

    return ids.map((obj) => obj.id);
  }

  private async getTeams(seasonId: string): Promise<string[]> {
    const sql = "SELECT id from teams WHERE season_id = ?";
    const ids = await this.dbContext.query(sql, [seasonId]);

    return ids.map((obj) => obj.id);
  }
}
