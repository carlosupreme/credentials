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
import { DefaultPhotoProvider } from "../auth/domain/DefaultPhotoProvider";
import { UIAvatarsPhotoProvider } from "../auth/infrastructure/UIAvatarsPhotoProvider";

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

export { container };
