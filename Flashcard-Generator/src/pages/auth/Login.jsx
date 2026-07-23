import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/containers/AuthLayout";
import FieldInput from "../../components/ui/input/FieldInput";
import Button from "../../components/ui/button/Button";
import { loginSchema } from "../../schema/authSchema";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

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
            {formError && (
              <p className="text-red-400 font-semibold text-sm">{formError}</p>
            )}

            <FieldInput
              type="email"
              name="email"
              id="email"
              htmlFor="email"
              label="Email"
              placeholder="you@example.com"
            />
            <FieldInput
              type="password"
              name="password"
              id="password"
              htmlFor="password"
              label="Password"
              placeholder="••••••••"
            />

            <Button
              type="submit"
              disabled={!(isValid && dirty) || isSubmitting}
              text={isSubmitting ? "Signing In..." : "Sign In."}
              btnclass={`font-semibold rounded-md text-white text-lg px-6 py-3 mt-2 transition-all ${
                !isValid
                  ? "bg-gray-800 text-gray-500"
                  : "bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
              }`}
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;
