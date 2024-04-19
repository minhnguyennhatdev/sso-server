import { FlattenMaps, Types } from "mongoose";
import { User } from "../../../models/users";

export class UserDTO {
    name: string;
    username: string;
    id: string;

    constructor(
        user: FlattenMaps<User> & {
            _id: Types.ObjectId;
        }
    ) {
        this.id = user._id?.toString();
        this.name = user.name;
        this.username = user.username;
    }
}
