import mongoose from "mongoose";

const doctorHoursSchema = new mongoose.Schema({
  hours: {
    type: Number,
    default: 0,
  },
  workHoursInHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
});

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
    },
    specialization: {
      type: String,
      require: true,
    },
    qualifications: {
      type: String,
      require: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      require: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    docImage: {
      type: String,
    },
    workInHospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
      },
    ],
    docHours: {
      type: [doctorHoursSchema],
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
