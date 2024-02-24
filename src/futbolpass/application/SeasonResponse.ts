export class SeasonResponse {
  constructor(
    readonly id: string,
    readonly matchIds: string[],
    readonly teamIds: string[],
    readonly name: string,
    readonly startDate: Date,
    readonly endDate: Date
  ) {}
}
