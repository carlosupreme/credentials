export class PlayerTeamDetailsResponse {
  constructor(
    readonly id: string,
    readonly teamId: string | null,
    readonly position: string | null,
    readonly jerseyNumber: number | null
  ) {}
}

export class PlayerResponse {
  constructor(
    readonly id: string,
    readonly teamDetails: PlayerTeamDetailsResponse,
    readonly fullName: string,
    readonly age: number,
    readonly photo: string
  ) {}
}
