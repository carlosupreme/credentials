import { UserId } from "../../../auth/domain/value-objects/UserId";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { PlayerId } from "./PlayerId";
import { TeamId } from "../team/TeamId";
import { PlayerTeamDetails } from "./PlayerTeamDetails";

export class Player extends AggregateRoot<PlayerId> {
  constructor(
    id: PlayerId,
    readonly userId: UserId,
    readonly teamDetails: PlayerTeamDetails,
    readonly fullName: string,
    readonly age: number,
    readonly photo: string
  ) {
    super(id);
  }

  static create(userId: string, fullName: string, age: number, photo: string) {
    const player = new Player(
      PlayerId.create(),
      new UserId(userId),
      PlayerTeamDetails.create(null, null, null),
      fullName,
      age,
      photo
    );

    return player;
  }

  assignCurrentTeam(teamId: TeamId) {
    this.teamDetails.teamId = teamId;
  }

  currentTeam(): TeamId | null {
    return this.teamDetails.teamId;
  }
}
