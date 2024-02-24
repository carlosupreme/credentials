import { PlayerId } from "../player/PlayerId";
import { Match } from "./Match";
import { MatchId } from "./MatchId";

export interface MatchRepository {
  add(match: Match): Promise<void>;
  findById(id: MatchId): Promise<Match | null>;
  all(): Promise<Match[]>;
  saveAttendanceList(matchId: MatchId, playerId: PlayerId[]): Promise<void>;
}
