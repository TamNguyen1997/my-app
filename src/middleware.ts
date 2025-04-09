import { stackMiddlewares } from "./middlewares/StackHandler";
import { RedirectHandler } from "./middlewares/RedirectHandler";
import { LoginHandler } from "./middlewares/LoginHandler";
import { AdminAuthentication } from "./middlewares/AdminAuthentication";
import { AdminAuthorization } from "./middlewares/AdminAuthorization";
import { RemoveParenthesisRedirectHandler } from "./middlewares/RemoveParenthesisRedirectHandler";
import { Role } from "./middlewares/Role";

const middlewares = [
  Role,
  LoginHandler,
  AdminAuthentication,
  AdminAuthorization,
  RedirectHandler,
  RemoveParenthesisRedirectHandler,
];

export default stackMiddlewares(middlewares);
