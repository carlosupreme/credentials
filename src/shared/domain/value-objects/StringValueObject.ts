import { ValueObject } from "../ValueObject";

export abstract class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }

  public getEqualityComponents(): unknown[] {
    return [this.value];
  }
}
