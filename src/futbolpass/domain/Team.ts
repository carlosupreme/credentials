import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { PlayerId } from "./value-objects/PlayerId";
import { TeamId } from "./value-objects/TeamId";

export class Team extends AggregateRoot<TeamId> {
  readonly name: string;
  readonly logo: string;
  readonly playerIds: PlayerId[];

  constructor(id: TeamId, name: string, logo: string, playerIds: PlayerId[]) {
    super(id);
    this.name = name;
    this.logo = logo;
    this.playerIds = [...playerIds];
  }

  static create(name: string, logo: string) {
    const team = new Team(TeamId.create(), name, logo, []);

    return team;
  }
}
