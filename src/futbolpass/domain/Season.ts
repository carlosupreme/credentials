import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { GameId } from "./value-objects/GameId";
import { SeasonId } from "./value-objects/SeasonId";
import { TeamId } from "./value-objects/TeamId";

export class Season extends AggregateRoot<SeasonId> {
  readonly gameIds: GameId[];
  readonly teamIds: TeamId[];
  readonly name: string;
  readonly startsAt: Date;
  readonly endsAt: Date;

  constructor(
    id: SeasonId,
    gameIds: GameId[],
    teamIds: TeamId[],
    name: string,
    startsAt: Date,
    endsAt: Date
  ) {
    super(id);
    this.gameIds = [...gameIds];
    this.teamIds = [...teamIds];
    this.name = name;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
  }

  static create(name: string, startsAt: Date, endsAt: Date): Season {
    const season = new Season(
      SeasonId.create(),
      [],
      [],
      name,
      startsAt,
      endsAt
    );

    // Domain event Season created

    return season;
  }

  public getGameIds() {
    return [...this.gameIds.map((i) => i.value)];
  }

  public getTeamIds() {
    return [...this.teamIds.map((i) => i.value)];
  }
}
