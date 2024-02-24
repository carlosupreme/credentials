import { injectable } from "inversify";
import { DomainEventBus } from "../../../shared/infrastructure/PublishDomainEventsInterceptor";
import { MySQLConnection } from "../../../shared/infrastructure/MySQLConnection";
import { Mediator } from "mediatr-ts";
import { RowDataPacket } from "mysql2";
import { TeamId } from "../../domain/team/TeamId";
import { MatchRepository } from "../../domain/match/MatchRepository";
import { Match } from "../../domain/match/Match";
import { MatchId } from "../../domain/match/MatchId";
import { SeasonId } from "../../domain/season/SeasonId";
import { PlayerId } from "../../domain/player/PlayerId";
import { Attendance } from "../../domain/match/AttendanceList";
import { AttendanceId } from "../../domain/match/AttendanceListId";

interface MatchMySQL extends RowDataPacket {
  id: string;
  season_id: string;
  name: string;
  home_team_id: string;
  home_away_id: number;
  home_score: number;
  away_score: number;
  date: Date;
}

interface AttendanceMySQL extends RowDataPacket {
  id: string;
  match_id: string;
  player_id: string;
  assist: boolean;
}

@injectable()
export class MySQLMatchRepository
  extends DomainEventBus
  implements MatchRepository
{
  constructor(readonly dbContext: MySQLConnection, mediator: Mediator) {
    super(mediator);
  }

  async addPlayerAttendance(
    matchId: MatchId,
    playerId: PlayerId
  ): Promise<void> {
    await this.dbContext.query(
      "UPDATE attendance_lists SET assist = ? WHERE match_id = ? AND player_id = ?",
      [true, matchId.value, playerId.value]
    );
  }

  async getAttendanceList(matchId: MatchId): Promise<Attendance[]> {
    const sql = `SELECT id, player_id, assist FROM attendance_lists WHERE match_id = ?`;

    const attendanceMySQL = await this.dbContext.query<AttendanceMySQL[]>(sql, [
      matchId.value,
    ]);

    if (!attendanceMySQL) return [];

    return attendanceMySQL.map(
      (attendance) =>
        new Attendance(
          new AttendanceId(attendance.id),
          matchId,
          new PlayerId(attendance.player_id),
          attendance.assist
        )
    );
  }

  async all(): Promise<Match[]> {
    const sql = `SELECT id, season_id, name,home_team_id, away_team_id, home_score, away_score, date FROM matches`;

    const matchesMySQL = await this.dbContext.query<MatchMySQL[]>(sql, []);

    if (!matchesMySQL) return [];

    const matches: Match[] = [];

    for (const matchMySQL of matchesMySQL) {
      const id = new MatchId(matchMySQL.id);
      matches.push(
        new Match(
          id,
          new SeasonId(matchMySQL.season_id),
          new TeamId(matchMySQL.home_team_id),
          new TeamId(matchMySQL.away_team_id),
          matchMySQL.name,
          matchMySQL.date,
          matchMySQL.home_score,
          matchMySQL.away_score,
          await this.getAttendanceList(id)
        )
      );
    }

    return matches;
  }

  findById(id: MatchId): Promise<Match | null> {
    return this.findOneBy("id", id.value);
  }

  private async findOneBy(by: string, value: string): Promise<Match | null> {
    const sql = `SELECT id, season_id, name, home_team_id, away_team_id, home_score, away_score, date FROM matches WHERE ${by} = ? LIMIT 1`;

    const matchMySQL = (
      await this.dbContext.query<MatchMySQL[]>(sql, [value])
    )[0];

    if (!matchMySQL) return null;

    const id = new MatchId(matchMySQL.id);

    return new Match(
      id,
      new SeasonId(matchMySQL.season_id),
      new TeamId(matchMySQL.home_team_id),
      new TeamId(matchMySQL.away_team_id),
      matchMySQL.name,
      matchMySQL.date,
      matchMySQL.home_score,
      matchMySQL.away_score,
      await this.getAttendanceList(id)
    );
  }

  async add(match: Match): Promise<void> {
    await this.dbContext.beginTransaction();

    try {
      await Promise.all([
        this.insertMatch(match),
        this.insertAttendanceList(match),
        this.dbContext.commit(),
        this.publishEvents([match]),
      ]);
    } catch (error) {
      console.log({
        playerMySQLError: error,
      });

      await this.dbContext.rollback();
    }
  }

  private async insertMatch(match: Match) {
    await this.dbContext.query(
      "INSERT INTO matches(id, season_id, home_team_id, away_team_id, name, date, home_score, away_score) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        match.id.value,
        match.seasonId.value,
        match.homeTeamId.value,
        match.awayTeamId.value,
        match.name,
        match.date,
        match.homeScore,
        match.awayScore,
      ]
    );
  }

  async insertAttendanceList(match: Match): Promise<void> {
    for (const attendance of match.attendanceList) {
      await this.dbContext.query(
        "INSERT INTO attendance_lists(id, match_id, player_id, assist) VALUES(?, ?, ?, ?)",
        [
          attendance.id.value,
          match.id.value,
          attendance.playerId.value,
          attendance.assists,
        ]
      );
    }
  }
}
