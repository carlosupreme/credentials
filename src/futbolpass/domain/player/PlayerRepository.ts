import { Player } from "./Player";
import { PlayerId } from "./PlayerId";
import { PlayerTeamDetails } from "./PlayerTeamDetails";

export interface PlayerRepository {
  add: (player: Player) => Promise<void>;
  findById: (id: PlayerId) => Promise<Player | null>;
  addTeamDetails: (teamDetails: PlayerTeamDetails) => Promise<void>;
  all: () => Promise<Player[]>;
}
