import Joi from "joi";

const validationSchemas = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": `"email" must be a valid email address`,
    "any.required": `"email" is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
});

export { validationSchemas };