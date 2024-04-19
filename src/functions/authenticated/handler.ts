import { apiHandler } from "../../commons/utils";
import { process } from "./service";

export const handler = apiHandler(process);
