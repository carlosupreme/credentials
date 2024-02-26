import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { MatchId } from "./MatchId";
import { TeamId } from "../team/TeamId";
import { SeasonId } from "../league/SeasonId";
import { Attendance } from "./AttendanceList";
import { PlayerId } from "../player/PlayerId";
import { AttendanceId } from "./AttendanceListId";

export class Match extends AggregateRoot<MatchId> {
  constructor(
    id: MatchId,
    readonly seasonId: SeasonId,
    readonly homeTeamId: TeamId,
    readonly awayTeamId: TeamId,
    readonly name: string,
    readonly date: Date,
    private _homeScore: number,
    private _awayScore: number,
    readonly attendanceList: Attendance[]
  ) {
    super(id);
  }

  private static createAttendanceList(matchId: MatchId, playerIds: PlayerId[]) {
    const attendanceList: Attendance[] = playerIds.map((playerId) => {
      return new Attendance(AttendanceId.create(), matchId, playerId, false);
    });

    return attendanceList;
  }

  static create(
    seasonId: string,
    homeTeamId: string,
    awayTeamId: string,
    name: string,
    date: Date,
    playerIds: PlayerId[]
  ) {
    const id = MatchId.create();
    const match = new Match(
      id,
      new SeasonId(seasonId),
      new TeamId(homeTeamId),
      new TeamId(awayTeamId),
      name,
      date,
      0,
      0,
      Match.createAttendanceList(id, playerIds)
    );

    return match;
  }

  playerAssists(playerId: PlayerId) {
    this.attendanceList.forEach((attendance) => {
      if (attendance.playerId.equals(playerId)) {
        attendance.playerAssists();
      }
    });
  }

  homeTeamScores() {
    this._homeScore++;
  }

  awayTeamScores() {
    this._awayScore++;
  }

  get homeScore() {
    return this._homeScore;
  }

  get awayScore() {
    return this._awayScore;
  }
}
