import { Schema, model } from "mongoose";

const teamSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  problems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Team = model("Team", problemSchema);

export default Team;
