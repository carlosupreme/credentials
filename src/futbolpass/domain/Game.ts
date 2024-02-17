import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { GameId } from "./value-objects/GameId";
import { TeamId } from "./value-objects/TeamId";

export class Game extends AggregateRoot<GameId> {
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;

  constructor(
    id: GameId,
    homeTeamId: TeamId,
    awayTeamId: TeamId,
    homeScore: number,
    awayScore: number
  ) {
    super(id);
    this.homeTeamId = homeTeamId;
    this.awayTeamId = awayTeamId;
    this.homeScore = homeScore;
    this.awayScore = awayScore;
  }

  static create(homeTeamId: TeamId, awayTeamId: TeamId) {
    const game = new Game(GameId.create(), homeTeamId, awayTeamId, 0, 0);

    return game;
  }
}
