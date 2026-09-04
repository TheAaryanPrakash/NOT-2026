import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../layouts/containers/AuthLayout";
import FieldInput from "../../components/ui/input/FieldInput";
import Button from "../../components/ui/button/Button";
import { signupSchema } from "../../schema/authSchema";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  return (
    <AuthLayout
      title="Sign Up."
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkTo="/login"
    >
      <AnimatePresence mode="wait">
        {confirmMessage ? (
          <motion.p
            key="confirm-message"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-center text-gray-300"
          >
            {confirmMessage}
          </motion.p>
        ) : (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={signupSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setFormError("");
                const { data, error } = await signUp(values.email, values.password, {
                  data: { full_name: values.name },
                });
                setSubmitting(false);

                if (error) {
                  setFormError(error.message);
                  return;
                }

                // If email confirmation is required, Supabase returns no session yet.
                if (!data.session) {
                  setConfirmMessage(
                    "Check your inbox to confirm your email, then sign in."
                  );
                  return;
                }

                navigate("/app", { replace: true });
              }}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form className="flex flex-col gap-6" autoComplete="off">
                  <AnimatePresence>
                    {formError && (
                      <motion.p
                        key="form-error"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="text-brandRed font-semibold text-sm"
                      >
                        {formError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <FieldInput
                        name="name"
                        id="name"
                        htmlFor="name"
                        label="Name"
                        placeholder="Jane Doe"
                        widthClassName="w-full"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.22 }}
                    >
                      <FieldInput
                        type="email"
                        name="email"
                        id="email"
                        htmlFor="email"
                        label="Email"
                        placeholder="you@example.com"
                        widthClassName="w-full"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.29 }}
                    >
                      <FieldInput
                        type="password"
                        name="password"
                        id="password"
                        htmlFor="password"
                        label="Password"
                        placeholder="At least 6 characters"
                        widthClassName="w-full"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.36 }}
                    >
                      <FieldInput
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        htmlFor="confirmPassword"
                        label="Repeat Password"
                        placeholder="••••••••"
                        widthClassName="w-full"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.43 }}
                    >
                      <Button
                        type="submit"
                        disabled={!(isValid && dirty) || isSubmitting}
                        text={isSubmitting ? "Signing Up..." : "Sign Up."}
                        btnclass={`w-full font-semibold rounded-xl text-base px-6 py-3 mt-2 transition-colors ${
                          !(isValid && dirty)
                            ? "bg-brandBorder text-gray-500"
                            : "bg-brandCyan text-black hover:bg-white shadow-glow"
                        }`}
                      />
                    </motion.div>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Signup;
