export class MatchResponse {
  constructor(
    readonly id: string,
    readonly seasonId: string,
    readonly homeTeamId: string,
    readonly awayTeamId: string,
    readonly name: string,
    readonly date: Date,
    readonly homeScore: number,
    readonly awayScore: number,
    readonly attendanceList: string[]
  ) {}
}
