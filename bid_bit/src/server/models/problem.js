import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
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

    tags: [String],

    testCases: [
      {
        input: { type: String, required: true },

        expectedOutput: { type: String, required: true },
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
  },

  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
