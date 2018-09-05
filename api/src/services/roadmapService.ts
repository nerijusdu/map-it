import { Roadmap, User } from "../models";
import { EntityServiceBase } from "./entityServiceBase";

export default (user?: User) => new EntityServiceBase(Roadmap, user);
