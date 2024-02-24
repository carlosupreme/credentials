import { Season } from "./Season";
import { SeasonId } from "./SeasonId";

export interface SeasonRepository {
  add(season: Season): Promise<void>;
  findById(id: SeasonId): Promise<Season | null>;
  findByName(name: string): Promise<Season | null>;
  all(): Promise<Season[]>;
}
