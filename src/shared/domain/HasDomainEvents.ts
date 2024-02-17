import { DomainEvent } from "./DomainEvent";

export interface HasDomainEvents {
  addDomainEvent(domainEvent: DomainEvent): void;
  clearDomainEvents(): void;
  getDomainEvents(): DomainEvent[];
}
