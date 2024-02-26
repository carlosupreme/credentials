import { injectable } from "inversify";
import { DomainEventBus } from "../../../shared/infrastructure/PublishDomainEventsInterceptor";
import { MySQLConnection } from "../../../shared/infrastructure/MySQLConnection";
import { Mediator } from "mediatr-ts";
import { TeamRepository } from "../../domain/team/TeamRepository";
import { Team } from "../../domain/team/Team";
import { TeamId } from "../../domain/team/TeamId";
import { RowDataPacket } from "mysql2";
import { PlayerId } from "../../domain/player/PlayerId";
import { SeasonId } from "../../domain/league/SeasonId";

interface TeamMySQL extends RowDataPacket {
  id: string;
  season_id: string;
  name: string;
  logo: string;
}

@injectable()
export class MySQLTeamRepository
  extends DomainEventBus
  implements TeamRepository
{
  constructor(readonly dbContext: MySQLConnection, mediator: Mediator) {
    super(mediator);
  }

  async all(): Promise<Team[]> {
    const sql = `SELECT id, season_id, name, logo FROM teams;`;

    const teamsMySQL = await this.dbContext.query<TeamMySQL[]>(sql, []);

    if (!teamsMySQL) return [];

    const teams: Team[] = [];

    for (const teamMySQL of teamsMySQL) {
      teams.push(
        new Team(
          new TeamId(teamMySQL.id),
          new SeasonId(teamMySQL.season_id),
          teamMySQL.name,
          teamMySQL.logo,
          (await this.getPlayers(teamMySQL.id)).map((id) => new PlayerId(id))
        )
      );
    }

    return teams;
  }

  async add(team: Team): Promise<void> {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.inserTeam(team),
        this.dbContext.commit(),
        this.publishEvents([team]),
      ]);
    } catch (error) {
      console.log({
        teamMYSQLERROR: error,
      });

      await this.dbContext.rollback();
    }
  }

  private async inserTeam(team: Team) {
    await this.dbContext.query(
      "INSERT INTO teams(id, season_id, name, logo) VALUES(?, ?, ?, ?)",
      [team.id.value, team.seasonId.value, team.name, team.logo]
    );
  }

  async findById(id: TeamId): Promise<Team | null> {
    return await this.findOneBy("id", id.value);
  }

  async findByName(name: string): Promise<Team | null> {
    return await this.findOneBy("name", name);
  }

  private async findOneBy(by: string, value: string): Promise<Team | null> {
    const sql = `SELECT id, season_id, name, logo FROM teams WHERE ${by} = ? LIMIT 1`;
    const objMySQL = (await this.dbContext.query<TeamMySQL[]>(sql, [value]))[0];

    if (!objMySQL) return null;

    console.log(objMySQL);
    

    return new Team(
      new TeamId(objMySQL.id),
      new SeasonId(objMySQL.season_id),
      objMySQL.name,
      objMySQL.logo,
      (await this.getPlayers(objMySQL.id)).map((id) => new PlayerId(id))
    );
  }

  private async getPlayers(teamId: string): Promise<string[]> {
    const sql = "SELECT id from player_team_details WHERE team_id = ?";
    const ids = await this.dbContext.query(sql, [teamId]);
    const playerIds: string[] = [];

    console.log({ids});
    

    for (const id of ids) {
      const playerId = (await this.dbContext.query(
        "SELECT id FROM players WHERE team_details = ?",
        [id.id]
      ))[0];
      playerIds.push(playerId.id);
    }
    

    return playerIds;
  }
}
