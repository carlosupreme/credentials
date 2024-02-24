import { Entity } from "../../../shared/domain/Entity";
import { PlayerId } from "../player/PlayerId";
import { AttendanceId } from "./AttendanceListId";
import { MatchId } from "./MatchId";

export class Attendance extends Entity<AttendanceId> {
  constructor(
    id: AttendanceId,
    readonly matchId: MatchId,
    readonly playerId: PlayerId,
    public assists: boolean
  ) {
    super(id);
  }

  playerAssists() {
    this.assists = true;
  }
}
