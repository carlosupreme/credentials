import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class AttendanceId extends Uuid {
  static create(): AttendanceId {
    return new AttendanceId(Uuid.random().value);
  }
}
