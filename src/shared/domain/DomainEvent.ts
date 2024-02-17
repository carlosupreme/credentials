import { injectable } from "inversify";
import { INotification } from "mediatr-ts";

@injectable()
export class DomainEvent implements INotification {
  readonly occurredOn: Date;
  public isPublished: boolean;

  constructor() {
    this.occurredOn = new Date(Date.now());
    this.isPublished = false;
  }
}
