import { INotificationHandler, notificationHandler } from "mediatr-ts";
import { UserRegistered } from "../../domain/events/UserRegistered";
import { injectable } from "inversify";

@injectable()
@notificationHandler(UserRegistered)
export class UserRegisteredHandler
  implements INotificationHandler<UserRegistered>
{
  async handle(notification: UserRegistered): Promise<void> {
    console.log("UserRegisteredHandler", notification);
  }
}
