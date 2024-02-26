// !  Import controllers first

// Controllers
import "../auth/infrastructure/AuthController";
import "../futbolpass/infrastructure/player/PlayerController";
import "../futbolpass/infrastructure/season/SeasonController";
import "../futbolpass/infrastructure/team/TeamController";
import "../futbolpass/infrastructure/match/MatchController";

// RequestHandlers
import "../auth/application/commands/register/RegisterCommandHandler";
import "../auth/application/events/UserRegisteredHandler";
import "../auth/application/queries/login/LoginQueryHandler";

import "../futbolpass/application/commands/season/CreateSeasonCommandHandler";
import "../futbolpass/application/queries/season/GetAllSeasonsQueryHandler";
import "../futbolpass/application/queries/season/GetSeasonByIdQueryHandler";

import "../futbolpass/application/commands/team/CreateTeamCommandHandler";
import "../futbolpass/application/queries/team/GetTeamByIdQueryHandler";

import "../futbolpass/application/commands/player/CreatePlayerCommandHandler";
import "../futbolpass/application/queries/player/GetPlayerByIdQueryHandler";
import "../futbolpass/application/queries/player/GetAllPlayersQueryHandler";

import "../futbolpass/application/commands/match/CreateMatchCommandHandler";
import "../futbolpass/application/queries/match/GetAllMatchesQueryHandler";
import "../futbolpass/application/queries/match/GetMatchByIdQueryHandler";
import "../futbolpass/application/commands/match/PlayerAssistsCommandHandler";

