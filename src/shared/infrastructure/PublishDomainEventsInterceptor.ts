import { injectable } from "inversify";
import { HasDomainEvents } from "../domain/HasDomainEvents";
import { Mediator } from "mediatr-ts";
import { DomainEvent } from "../domain/DomainEvent";

@injectable()
export class DomainEventBus {
  constructor(readonly mediator: Mediator) {}

  public async publishEvents(entities: HasDomainEvents[]): Promise<void> {
    const domainEvents: DomainEvent[] = [];

    for (const entity of entities) {
      domainEvents.push(...entity.getDomainEvents());
      entity.clearDomainEvents();
    }

    for (const event of domainEvents) {
      event.isPublished = true;
      await this.mediator.publish(event);
    }
  }
}
