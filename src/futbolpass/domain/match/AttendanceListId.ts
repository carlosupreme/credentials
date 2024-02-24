import { Uuid } from "../../../shared/domain/value-objects/Uuid";

export class AttendanceListId extends Uuid {
  static create(): AttendanceListId {
    return new AttendanceListId(Uuid.random().value);
  }
}
