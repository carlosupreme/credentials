export class TeamResponse {
  constructor(
    readonly id: string,
    readonly seasonId: string,
    readonly name: string,
    readonly logo: string,
    readonly playerIds: string[]
  ) {}
}
