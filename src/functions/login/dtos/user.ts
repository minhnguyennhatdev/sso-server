import { User } from "../../../models/users";

export class UserDTO {
    name: string;
    username: string;

    constructor(user: User) {
        this.name = user.name;
        this.username = user.username;
    }
}
