// !  Import controllers first

// Controllers
import "../auth/infrastructure/AuthController";

// RequestHandlers
import "../auth/application/commands/register/RegisterCommandHandler";
import "../auth/application/events/UserRegisteredHandler";
import "../auth/application/queries/login/LoginQueryHandler";