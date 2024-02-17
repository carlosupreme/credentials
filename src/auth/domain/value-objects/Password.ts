import { ValueObject } from "../../../shared/domain/ValueObject";
import bcrypt from "bcrypt";

export class Password extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
  
  public getEqualityComponents(): unknown[] {
    return [this.value];
  }

  static hash(plainTextPassword: string): Password {
    return new Password(
      bcrypt.hashSync(plainTextPassword, bcrypt.genSaltSync())
    );
  }

  matches(plainTextPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, this.value);
  }
}
