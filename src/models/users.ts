import mongoose, { InferSchemaType, Schema } from "mongoose";

// Schema
export const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
});

export type User = InferSchemaType<typeof UserSchema>;
// InferSchemaType will determine the type as follows:
// type User = {
//   name: string;
//   email: string;
//   avatar?: string;
// }

// `UserModel` will have `name: string`, etc.
export const UserModel = mongoose.model<User>("User", UserSchema);
