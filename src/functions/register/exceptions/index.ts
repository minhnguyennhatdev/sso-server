import { CommonExceptions } from "../../../configs/exeptions";

export class Exceptions extends CommonExceptions {
    static readonly RE_PASSWORD_NOT_MATCH = "RE_PASSWORD_NOT_MATCH";
    static readonly USER_EXISTED = "USER_EXISTED";
}
