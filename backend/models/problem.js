import { Schema, model } from "mongoose";

const problemSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    tags: [String],
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        hidden: { type: Boolean, required: true },
      },
    ],
    constraints: [
      {
        type: String,
        required: true,
      },
    ],
    examples: [
      {
        example: { type: Number, required: true },
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String },
      },
    ],
    team: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true },
);

const Problem = model("Problem", problemSchema);

export default Problem;
