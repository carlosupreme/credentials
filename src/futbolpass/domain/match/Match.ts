import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { MatchId } from "./MatchId";
import { TeamId } from "../team/TeamId";
import { SeasonId } from "../season/SeasonId";
import { PlayerId } from "../player/PlayerId";

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
    readonly attendanceList: PlayerId[]
  ) {
    super(id);
  }

  static create(
    seasonId: string,
    homeTeamId: string,
    awayTeamId: string,
    name: string,
    date: Date
  ) {
    const game = new Match(
      MatchId.create(),
      new SeasonId(seasonId),
      new TeamId(homeTeamId),
      new TeamId(awayTeamId),
      name,
      date,
      0,
      0,
      []
    );

    return game;
  }

  addPlayerAttendance(playerId: PlayerId) {
    this.attendanceList.push(playerId);
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
