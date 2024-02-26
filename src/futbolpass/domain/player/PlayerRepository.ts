import { Player } from "./Player";
import { PlayerId } from "./PlayerId";

export interface PlayerRepository {
  add: (player: Player) => Promise<void>;
  findById: (id: PlayerId) => Promise<Player | null>;
  all: () => Promise<Player[]>;
}
