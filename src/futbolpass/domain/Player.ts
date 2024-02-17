import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { PlayerId } from "./value-objects/PlayerId";

export class Player extends AggregateRoot<PlayerId> {
  constructor(
    id: PlayerId,
    readonly fullName: string,
    readonly team: string,
    readonly jersey: number

  ) {
    super(id);
  }
}
