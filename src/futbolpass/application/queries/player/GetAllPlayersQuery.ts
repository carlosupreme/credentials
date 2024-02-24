import { IQuery } from "../../../../shared/application/queries/IQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { PlayerResponse } from "../../commands/player/CreatePlayerResponse";

export class GetAllPlayersQuery implements IQuery<ErrorOr<PlayerResponse>> {}
