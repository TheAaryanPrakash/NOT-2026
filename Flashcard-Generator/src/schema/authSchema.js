import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters long")
    .required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
