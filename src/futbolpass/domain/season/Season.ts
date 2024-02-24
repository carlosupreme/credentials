import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { MatchId } from "../match/MatchId";
import { SeasonId } from "./SeasonId";
import { TeamId } from "../team/TeamId";

export class Season extends AggregateRoot<SeasonId> {
  readonly matchIds: MatchId[];
  readonly teamIds: TeamId[];
  readonly name: string;
  readonly startDate: Date;
  readonly endDate: Date;

  constructor(
    id: SeasonId,
    matchIds: MatchId[],
    teamIds: TeamId[],
    name: string,
    startDate: Date,
    endDate: Date
  ) {
    super(id);
    this.matchIds = [...matchIds];
    this.teamIds = [...teamIds];
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static create(name: string, startDate: Date, endDate: Date): Season {
    const season = new Season(
      SeasonId.create(),
      [],
      [],
      name,
      startDate,
      endDate
    );

    // Domain event Season created

    return season;
  }

  public getMatchIds() {
    return [...this.matchIds.map((i) => i.value)];
  }

  public getTeamIds() {
    return [...this.teamIds.map((i) => i.value)];
  }

  public addMatch(matchId: MatchId) {
    this.matchIds.push(matchId);
  }

  public removeMatch(matchId: MatchId) {
    const index = this.matchIds.findIndex((id) => id.equals(matchId));
    if (index !== -1) {
      this.matchIds.splice(index, 1);
    }
  }

  public addTeam(teamId: TeamId) {
    this.teamIds.push(teamId);
  }

  public removeTeam(teamId: TeamId) {
    const index = this.teamIds.findIndex((id) => id.equals(teamId));
    if (index !== -1) {
      this.teamIds.splice(index, 1);
    }
  }
}
