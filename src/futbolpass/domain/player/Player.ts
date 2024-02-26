import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { PlayerId } from "./PlayerId";
import { PlayerTeamDetails } from "./PlayerTeamDetails";

export class Player extends AggregateRoot<PlayerId> {
  constructor(
    id: PlayerId,
    readonly teamDetails: PlayerTeamDetails,
    readonly fullName: string,
    readonly age: number,
    readonly photo: string
  ) {
    super(id);
  }

  static create(
    fullName: string,
    age: number,
    photo: string,
    teamDetails: PlayerTeamDetails
  ) {
    const player = new Player(
      PlayerId.create(),
      teamDetails,
      fullName,
      age,
      photo
    );

    return player;
  }
}
