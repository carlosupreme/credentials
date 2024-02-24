import { IQuery } from "../../../../shared/application/queries/IQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { SeasonResponse } from "../../SeasonResponse";

export class GetAllSeasonsQuery implements IQuery<ErrorOr<SeasonResponse>> {}
