import { DomainEvent } from "./DomainEvent";
import { HasDomainEvents } from "./HasDomainEvents";
import { IEquatable } from "./ValueObject";

export abstract class Entity<TId extends IEquatable>
  implements HasDomainEvents
{
  readonly id: TId;
  private _createdAt: Date;
  private _updatedAt: Date;
  private readonly _domainEvents: DomainEvent[];

  constructor(id: TId) {
    this.id = id;
    this._createdAt = new Date(Date.now());
    this._updatedAt = new Date(Date.now());
    this._domainEvents = [];
  }

  getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  clearDomainEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  equals(other: Entity<TId>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.id.equals(this.id)
    );
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public set updatedAt(value: Date) {
    this._updatedAt = value;
  }
}
