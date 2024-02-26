import "reflect-metadata";
import { Container } from "inversify";
import { IResolver, Mediator, mediatorSettings } from "mediatr-ts";
import { MySQLConnection } from "../shared/infrastructure/MySQLConnection";
import { UserRepository } from "../auth/domain/UserRepository";
import { MySQLUserRepository } from "../auth/infrastructure/MySQLUserRepository";
import { JsonWebTokenProvider } from "../auth/infrastructure/JsonWebTokenProvider";
import { IJWTProvider } from "../auth/domain/IJWTProvider";
import { constants } from "./constants";
import { DomainEventBus } from "../shared/infrastructure/PublishDomainEventsInterceptor";
import { DefaultPhotoProvider } from "../futbolpass/domain/player/DefaultPhotoProvider";
import { UIAvatarsPhotoProvider } from "../futbolpass/infrastructure/player/UIAvatarsPhotoProvider";
import { PlayerRepository } from "../futbolpass/domain/player/PlayerRepository";
import { MySQLPlayerRepository } from "../futbolpass/infrastructure/player/MySQLPlayerRepository";
import { MySQLSeasonRepository } from "../futbolpass/infrastructure/season/MySQLSeasonRepository";
import { MySQLTeamRepository } from "../futbolpass/infrastructure/team/MySQLTeamRepository";
import { SeasonRepository } from "../futbolpass/domain/league/SeasonRepository";
import { TeamRepository } from "../futbolpass/domain/team/TeamRepository";
import { MatchRepository } from "../futbolpass/domain/match/MatchRepository";
import { MySQLMatchRepository } from "../futbolpass/infrastructure/match/MySQLMatchRepository";

const container = new Container({
  skipBaseClassChecks: true,
  autoBindInjectable: true,
});

class Resolver implements IResolver {
  resolve<T>(name: string): T {
    return container.get<T>(name);
  }

  add(name: string, instance: Function): void {
    container.bind(name).to(instance as any);
  }

  remove(name: string): void {
    container.unbind(name);
  }

  clear(): void {
    container.unbindAll();
  }
}

mediatorSettings.resolver = new Resolver();

container.bind(Mediator).toConstantValue(new Mediator());
container.bind(MySQLConnection).toConstantValue(new MySQLConnection());
container
  .bind(DomainEventBus)
  .toConstantValue(new DomainEventBus(container.get(Mediator)));

container
  .bind<UserRepository>(constants.UserRepository)
  .to(MySQLUserRepository);

container.bind<IJWTProvider>(constants.IJWTProvider).to(JsonWebTokenProvider);

container
  .bind<DefaultPhotoProvider>(constants.DefaultPhotoProvider)
  .to(UIAvatarsPhotoProvider);

container
  .bind<SeasonRepository>(constants.SeasonRepository)
  .to(MySQLSeasonRepository);

container
  .bind<TeamRepository>(constants.TeamRepository)
  .to(MySQLTeamRepository);

container
  .bind<PlayerRepository>(constants.PlayerRepository)
  .to(MySQLPlayerRepository);

container
  .bind<MatchRepository>(constants.MatchRepository)
  .to(MySQLMatchRepository);

export { container };
