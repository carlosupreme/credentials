import { ICommand } from "../../../../shared/application/commands/ICommand";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { AttendanceListResponse } from "../../AttendanceListResponse";

export class AddPlayerAttendanceListCommand
  implements ICommand<ErrorOr<AttendanceListResponse>>
{
  constructor(readonly matchId: string, readonly playerId: string) {}
}
