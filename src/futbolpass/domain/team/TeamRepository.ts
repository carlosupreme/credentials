import { Team } from "./Team";
import { TeamId } from "./TeamId";

export interface TeamRepository {
  add(team: Team): Promise<void>;
  findById(id: TeamId): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  all(): Promise<Team[]>;
}
