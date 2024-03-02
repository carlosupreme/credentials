import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { PlayerId } from "./PlayerId";
import { PlayerTeamDetails } from "./PlayerTeamDetails";

export class Player extends AggregateRoot<PlayerId> {
  constructor(
    id: PlayerId,
    public teamDetails: PlayerTeamDetails,
    public fullName: string,
    public age: number,
    public photo: string
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


  update(data: {
    fullName: string,
    age: number,
    photo: string,
  }) {
    this.fullName = data.fullName;
    this.age = data.age;
    this.photo = data.photo;
  }
}
