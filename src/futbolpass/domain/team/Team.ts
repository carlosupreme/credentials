import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { PlayerId } from "../player/PlayerId";
import { SeasonId } from "../season/SeasonId";
import { TeamId } from "./TeamId";

export class Team extends AggregateRoot<TeamId> {
  readonly seasonId: SeasonId;
  private _name: string;
  private _logo: string;
  readonly playerIds: PlayerId[];

  constructor(
    id: TeamId,
    seasonId: SeasonId,
    name: string,
    logo: string,
    playerIds: PlayerId[]
  ) {
    super(id);
    this.seasonId = seasonId;
    this._name = name;
    this._logo = logo;
    this.playerIds = [...playerIds];
  }

  static create(seasonId: string, name: string, logo: string) {
    const team = new Team(
      TeamId.create(),
      new SeasonId(seasonId),
      name,
      logo,
      []
    );

    return team;
  }

  getPlayerIds() {
    return this.playerIds.map((id) => id.value);
  }
  
  addPlayer(playerId: PlayerId) {
    this.playerIds.push(playerId);
  }

  removePlayer(playerId: PlayerId) {
    const index = this.playerIds.findIndex((id) => id.equals(playerId));
    if (index !== -1) {
      this.playerIds.splice(index, 1);
    }
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get logo() {
    return this._logo;
  }

  set logo(logo: string) {
    this._logo = logo;
  }
}
