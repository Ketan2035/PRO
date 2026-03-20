import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mob: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?[0-9]{10,15}$/, "Invalid phone number"],
    },

    profession: {
      type: String,
      required: true,
      // enum: ["doctor", "plumber", "electrician", "cleaner", "other","developer"],
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    service_area: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Professional", professionalSchema);