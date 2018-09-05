import { Task, User } from "../models";
import { EntityServiceBase } from "./entityServiceBase";

export default (user?: User) => new EntityServiceBase(Task, user);
