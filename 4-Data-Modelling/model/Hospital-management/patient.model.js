import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    emergencyAddress: {
      type: String,
      require: true,
    },
    bloodGroup: {
      type: String,
      require: true,
    },
    emergencyContactName: {
      type: String,
      require: true,
    },
    emergencyContactPhone: {
      type: Number,
      require: true,
    },
    medicalHistory: {
      type: String,
    },
    currentMedication: {
      type: String,
    },
    allergies: {
      type: String,
    },
    patImage: {
      type: String,
    },
    admitedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
