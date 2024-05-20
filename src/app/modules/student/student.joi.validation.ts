import Joi from "joi";

const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
      .trim()
      .max(50)
      .regex(/^[A-Z][a-zA-Z]*$/)
      .required()
      .messages({
        "string.pattern.base": "{#label} is not in capitalized format.",
        "string.max": "{#label} is not allowed more than 50 characters.",
        "any.required": "{#label} is needed."
      }),
    middleName: Joi.string().trim().optional(),
    lastName: Joi.string()
      .trim()
      .max(20)
      .regex(/^[A-Za-z]+$/)
      .required()
      .messages({
        "string.pattern.base": "{#label} is not valid.",
        "string.max": "{#label} is not allowed more than 20 characters.",
        "any.required": "{#label} is needed."
      }),
  });
  
  const gurdianValidationSchema = Joi.object({
    fatherName: Joi.string().trim().required().messages({
      "any.required": "fatherName is needed.",
    }),
    fatherOccupation: Joi.string().trim().required().messages({
      "any.required": "fatherOccupation is needed.",
    }),
    fatherContactNumber: Joi.string().trim().required().messages({
      "any.required": "fatherContactNumber is needed.",
    }),
    motherName: Joi.string().trim().required().messages({
      "any.required": "motherName is needed.",
    }),
    motherOccupation: Joi.string().trim().required().messages({
      "any.required": "motherOccupation is needed.",
    }),
    motherContactNumber: Joi.string().trim().required().messages({
      "any.required": "motherContactNumber is needed.",
    }),
  });
  
  const localGurdianValidationSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      "any.required": "name is needed.",
    }),
    occupation: Joi.string().trim().required().messages({
      "any.required": "occupation is needed.",
    }),
    contactNo: Joi.string().trim().required().messages({
      "any.required": "contactNo is needed.",
    }),
    address: Joi.string().trim().required().messages({
      "any.required": "address is needed.",
    }),
  });
  
  // Define main schema
  
  const studentValidationSchema = Joi.object({
    id: Joi.string().trim().required().messages({
      "any.required": "id is needed.",
    }),
    name: userNameValidationSchema.required().messages({
      "any.required": "name is needed.",
    }),
    gender: Joi.string()
      .trim()
      .valid("male", "female", "other")
      .required()
      .messages({
        "any.only": "{#value} is not a valid gender.",
        "any.required": "gender is needed.",
      }),
    dateOfBirth: Joi.string().trim().optional(),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .messages({
        "string.email": "{#value} is not a valid email type.",
        "any.required": "email is needed.",
      }),
    contactNo: Joi.string().trim().required().messages({
      "any.required": "contactNo is needed.",
    }),
    emergencyContactNo: Joi.string().trim().required().messages({
      "any.required": "emergencyContactNo is needed.",
    }),
    bloodGroup: Joi.string()
      .trim()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
      .optional(),
    presentAddress: Joi.string().trim().required().messages({
      "any.required": "presentAddress is needed.",
    }),
    permanentAddress: Joi.string().trim().required().messages({
      "any.required": "permanentAddress is needed.",
    }),
    gurdian: gurdianValidationSchema.required().messages({
      "any.required": "Gurdian is needed for administrative purposes.",
    }),
    localGurdian: localGurdianValidationSchema.required().messages({
      "any.required": "Local Gurdian is needed for administrative purposes.",
    }),
    profileImg: Joi.string().optional(),
    isActive: Joi.string()
      .valid("active", "blocked")
      .default("active")
      .optional(),
  });

  export default studentValidationSchema;