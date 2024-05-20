import { z } from "zod";

// Define sub-schemas

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(50, "firstName is not allowed more than 50 characters.")
    .refine((str) => str.charAt(0).toUpperCase() + str.slice(1) === str, {
      message: "firstName is not in capitalized format.",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, "lastName is not allowed more than 20 characters.")
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: "lastName is not valid.",
    }),
});

const gurdianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNumber: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNumber: z.string(),
});

const localGurdianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define main schema

const studentValidationSchema = z.object({
  id: z.string(),
  password: z.string().max(30),
  name: userNameValidationSchema,
  gender: z.enum(["male", "female", "other"], {
    message: "{VALUE} is not a valid gender.",
  }),
  dateOfBirth: z.string().optional(),
  email: z.string().email("{VALUE} is not a valid email type."),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  gurdian: gurdianValidationSchema,
  localGurdian: localGurdianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(["active", "blocked"]).default("active"),
  isDeleted: z.boolean(),
});

export default studentValidationSchema;
