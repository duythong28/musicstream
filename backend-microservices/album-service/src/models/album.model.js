import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    songIds: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Album = mongoose.model("Album", albumSchema);