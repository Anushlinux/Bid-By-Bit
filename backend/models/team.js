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
  score: {
    type: Number,
    default: 0,
  },
  wrongSubmissions: {
    type: Number,
    default: 0,
  },
});

const Team = model("Team", teamSchema);

export default Team;
