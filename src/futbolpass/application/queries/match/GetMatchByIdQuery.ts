import { IQuery } from "../../../../shared/application/queries/IQuery";
import { ErrorOr } from "../../../../shared/domain/errors/ErrorOr";
import { MatchResponse } from "../../MatchResponse";

export class GetMatchByIdQuery implements IQuery<ErrorOr<MatchResponse>> {
    constructor(readonly id: string){}
}