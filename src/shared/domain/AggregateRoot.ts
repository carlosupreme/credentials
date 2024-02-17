import { Entity } from "./Entity";
import { IEquatable } from "./ValueObject";

export abstract class AggregateRoot<
  TId extends IEquatable
> extends Entity<TId> {
  constructor(id: TId) {
    super(id);
  }
}
