import { Schema, model } from "mongoose";

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String },
  email: { type: String },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
  },
  photo_url: { type: String },
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  refresh_token: { type: String },
});

const User = model("User", userSchema);

export default User;
