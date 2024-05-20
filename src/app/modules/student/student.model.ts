import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

import {
  TGurdian,
  TLocalGurdian,
  TStudent,
  StudentModel,
  TUserName,
  // eslint-disable-next-line no-unused-vars
  studentMethods,
} from "./student.interface";
import config from "../../config";
import { get } from "http";

// sub schema

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "firstName is needed."],
    trim: true,
    maxlength: [50, "firstName is not allowed more than 50 characters."],
    validate: {
      validator: function (str: string) {
        const value = str.charAt(0).toUpperCase() + str.slice(1);
        return value === str;
      },
      message: "{VALUE} is not in capitalized format.",
    },
  },
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    trim: true,
    required: [true, "lastName is needed."],
    maxlength: [20, "laststName is not allowed more than 20 characters."],
    validate: {
      validator: (value: string) => {
        validator.isAlpha(value);
      },
      message: "{VALUE} is not valid.",
    },
  },
});

const gurdianSchema = new Schema<TGurdian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, "fatherName is needed."],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, "fatherOccupation is needed."],
  },
  fatherContactNumber: {
    type: String,
    trim: true,
    required: [true, "fatherContactNumber is needed."],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, "motherName is needed."],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, "motherOccupation is needed."],
  },
  motherContactNumber: {
    type: String,
    trim: true,
    required: [true, "motherContactNumber is needed."],
  },
});

const localGurdianSchema = new Schema<TLocalGurdian>({
  name: { type: String, trim: true, required: [true, "name is needed."] },
  occupation: {
    type: String,
    trim: true,
    required: [true, "occupation is needed."],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, "contactNo is needed."],
  },
  address: { type: String, trim: true, required: [true, "address is needed."] },
});

// main schema

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, trim: true, required: true, unique: true },
  password: {
    type: String,
    trim: true,
    required: true,
    maxLength: [20, "The password cannot be larger than 20 character."],
  },
  name: {
    type: userNameSchema,
    required: [true, "name is needed."],
  },
  gender: {
    type: String,
    trim: true,
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not a valid gender.",
    },
    required: true,
  },
  dateOfBirth: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email type.",
    },
  },
  contactNo: { type: String, trim: true, required: true },
  emergencyContactNo: { type: String, trim: true, required: true },
  bloodGroup: {
    type: String,
    trim: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  presentAddress: { type: String, trim: true, required: true },
  permanentAddress: { type: String, trim: true, required: true },
  gurdian: {
    type: gurdianSchema,
    required: [true, "Gurdian is needed for administrative purposes."],
  },
  localGurdian: {
    type: localGurdianSchema,
    required: [true, "Local Gurdian is needed for administrative purposes."],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  isDeleted: { type: Boolean, default: false },
},{
  toJSON:{
    virtuals: true,
  }
});


// virtual
studentSchema.virtual("fullName").get(function(){
  return(`${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`)
})



// pre save middleware --> will work on save
studentSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// post save middleware
studentSchema.post("save", function (doc, next) {
  doc.password = " ";
  next();
});

// query middleware

studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

// creating a custom instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });

//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
