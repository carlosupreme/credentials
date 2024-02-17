import { ValueObject } from "../../../shared/domain/ValueObject";
import { DomainError } from "../../../shared/domain/errors/DomainError";
export class Email extends ValueObject {
  constructor(readonly value: string) {
    super();
    this.ensureEmailIsValid(value);
  }

  private ensureEmailIsValid(value: string): void {
    if (!value) {
      throw DomainError.Validation("Empty Email", "Email should not be empty");
    }
  }

  public getEqualityComponents(): unknown[] {
    return [this.value];
  }
}
