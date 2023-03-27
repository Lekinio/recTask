import {Router} from "express";
import auth from "./auth.routes";
import user from "./user.routes";
import farm from "./farm.route";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use('/farm', farm);

export default routes;
