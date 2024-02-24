import { injectable } from "inversify";
import { Player } from "../../domain/player/Player";
import { PlayerRepository } from "../../domain/player/PlayerRepository";
import { DomainEventBus } from "../../../shared/infrastructure/PublishDomainEventsInterceptor";
import { MySQLConnection } from "../../../shared/infrastructure/MySQLConnection";
import { Mediator } from "mediatr-ts";
import { PlayerId } from "../../domain/player/PlayerId";
import { RowDataPacket } from "mysql2";
import { UserId } from "../../../auth/domain/value-objects/UserId";
import { PlayerTeamDetails } from "../../domain/player/PlayerTeamDetails";
import { PlayerTeamDetailsId } from "../../domain/player/PlayerTeamDetailsId";
import { TeamId } from "../../domain/team/TeamId";

interface PlayerMySQL extends RowDataPacket {
  id: string;
  user_id: string;
  team_details: string;
  full_name: string;
  age: number;
  photo: string;
}

interface TeamDetailsMySQL extends RowDataPacket {
  id: string;
  team_id: string | null;
  position: string | null;
  jersey_number: number | null;
}

@injectable()
export class MySQLPlayerRepository
  extends DomainEventBus
  implements PlayerRepository
{
  constructor(readonly dbContext: MySQLConnection, mediator: Mediator) {
    super(mediator);
  }

  async all(): Promise<Player[]> {
    const sql = `SELECT id, user_id, team_details, full_name, age, photo FROM players`;

    const playersMySQL = await this.dbContext.query<PlayerMySQL[]>(sql, []);

    if (!playersMySQL) return [];

    const players: Player[] = [];

    for (const playerMySQL of playersMySQL) {
      players.push(
        new Player(
          new PlayerId(playerMySQL.id),
          new UserId(playerMySQL.user_id),
          await this.getTeamDetailsById(playerMySQL.team_details),
          playerMySQL.full_name,
          playerMySQL.age,
          playerMySQL.photo
        )
      );
    }

    return players;
  }

  async addTeamDetails(teamDetails: PlayerTeamDetails): Promise<void> {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.dbContext.query(
          "UPDATE player_team_details SET team_id = ?, position = ?, jersey_number = ? WHERE id = ?",
          [
            teamDetails.teamId ? teamDetails.teamId.value : null,
            teamDetails.position,
            teamDetails.jerseyNumber,
            teamDetails.id.value,
          ]
        ),
        this.dbContext.commit(),
      ]);
    } catch (error) {
      console.log({
        playerMySQLError: error,
      });

      await this.dbContext.rollback();
    }
  }

  findById(id: PlayerId): Promise<Player | null> {
    return this.findOneBy("id", id.value);
  }

  private async findOneBy(by: string, value: string): Promise<Player | null> {
    const sql = `SELECT id, user_id, team_details, full_name, age, photo FROM players WHERE ${by} = ? LIMIT 1`;

    const objMySQL = (
      await this.dbContext.query<PlayerMySQL[]>(sql, [value])
    )[0];

    if (!objMySQL) return null;

    console.log({ objMySQL });

    const teamDetails = await this.getTeamDetailsById(objMySQL.team_details);

    return new Player(
      new PlayerId(objMySQL.id),
      new UserId(objMySQL.user_id),
      teamDetails,
      objMySQL.full_name,
      objMySQL.age,
      objMySQL.photo
    );
  }

  private async getTeamDetailsById(id: string): Promise<PlayerTeamDetails> {
    // just one team??
    const sql =
      "SELECT id, team_id, position, jersey_number FROM player_team_details WHERE id = ? LIMIT 1";

    const objMySQL = (
      await this.dbContext.query<TeamDetailsMySQL[]>(sql, [id])
    )[0];

    const teamDetails = new PlayerTeamDetails(
      new PlayerTeamDetailsId(objMySQL.id),
      objMySQL.team_id ? new TeamId(objMySQL.team_id) : null,
      objMySQL.position,
      objMySQL.jersey_number
    );

    return teamDetails;
  }

  async add(player: Player): Promise<void> {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.insertTeamDetails(player.teamDetails),
        this.insertPlayer(player),
        this.dbContext.commit(),
        this.publishEvents([player]),
      ]);
    } catch (error) {
      console.log({
        playerMySQLError: error,
      });

      await this.dbContext.rollback();
    }
  }

  private async insertPlayer(player: Player) {
    await this.dbContext.query(
      "INSERT INTO players(id, user_id, team_details, full_name, age, photo) VALUES(?, ?, ?, ?, ?, ?)",
      [
        player.id.value,
        player.userId.value,
        player.teamDetails.id.value,
        player.fullName,
        player.age,
        player.photo,
      ]
    );
  }

  private async insertTeamDetails(teamDetails: PlayerTeamDetails) {
    let sql =
      "INSERT INTO player_team_details(id, team_id, position, jersey_number) VALUES(?, ?, ?, ?)";

    const params: any[] = [
      teamDetails.id.value,
      teamDetails.teamId ? teamDetails.teamId.value : null,
      teamDetails.position,
      teamDetails.jerseyNumber,
    ];

    await this.dbContext.query(sql, params);
  }
}
