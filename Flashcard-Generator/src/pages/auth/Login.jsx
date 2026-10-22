import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../layouts/containers/AuthLayout";
import FieldInput from "../../components/ui/input/FieldInput";
import Button from "../../components/ui/button/Button";
import { loginSchema } from "../../schema/authSchema";
import { useAuth } from "../../context/AuthContext";

const DEMO_EMAIL = "aaryan.sprakash@gmail.com";
const DEMO_PASSWORD = "Test-123";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setFormError("");
    setDemoLoading(true);
    const { error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
    setDemoLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    navigate("/app", { replace: true });
  };

  return (
    <AuthLayout
      title="Sign In."
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/signup"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError("");
          const { error } = await signIn(values.email, values.password);
          setSubmitting(false);

          if (error) {
            setFormError(error.message);
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
                transition={{ duration: 0.4, delay: 0.23 }}
              >
                <FieldInput
                  type="password"
                  name="password"
                  id="password"
                  htmlFor="password"
                  label="Password"
                  placeholder="••••••••"
                  widthClassName="w-full"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.31 }}
              >
                <Button
                  type="submit"
                  disabled={!(isValid && dirty) || isSubmitting}
                  text={isSubmitting ? "Signing In..." : "Sign In."}
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

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-brandBorder" />
        <span className="text-xs text-gray-500 uppercase tracking-wide">or</span>
        <div className="h-px flex-1 bg-brandBorder" />
      </div>

      <Button
        type="button"
        fn={handleDemoLogin}
        disabled={demoLoading}
        text={demoLoading ? "Loading Demo..." : "View Demo"}
        btnclass="w-full font-semibold rounded-xl text-base px-6 py-3 border border-brandCyan text-brandCyan hover:bg-brandCyan hover:text-black transition-colors disabled:opacity-60"
      />
    </AuthLayout>
  );
};

export default Login;
