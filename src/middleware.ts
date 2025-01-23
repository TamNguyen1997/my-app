import { stackMiddlewares } from './middlewares/StackHandler'
import { RedirectHandler } from './middlewares/RedirectHandler'
import { LoginHandler } from './middlewares/LoginHandler'
import { AdminAuthentication } from './middlewares/AdminAuthentication'
import { AdminAuthorization } from './middlewares/AdminAuthorization'

const middlewares = [LoginHandler, AdminAuthentication, AdminAuthorization, RedirectHandler];

export default stackMiddlewares(middlewares)
