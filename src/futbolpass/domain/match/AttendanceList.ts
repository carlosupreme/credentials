import { Entity } from "../../../shared/domain/Entity";
import { AttendanceListId } from "./AttendanceListId";

export class AttendanceList extends Entity<AttendanceListId> {
  constructor(
    id: AttendanceListId,
    readonly playerId: string,
    

  ) {
    super(id);
  }
}
