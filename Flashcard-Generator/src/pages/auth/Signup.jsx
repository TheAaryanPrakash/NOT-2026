import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
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
      {confirmMessage ? (
        <p className="text-center text-gray-600">{confirmMessage}</p>
      ) : (
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
              {formError && (
                <p className="text-red-600 font-semibold text-sm">
                  {formError}
                </p>
              )}

              <FieldInput
                name="name"
                id="name"
                htmlFor="name"
                label="Name"
                placeholder="Jane Doe"
              />
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
                placeholder="At least 6 characters"
              />
              <FieldInput
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                htmlFor="confirmPassword"
                label="Repeat Password"
                placeholder="••••••••"
              />

              <Button
                type="submit"
                disabled={!(isValid && dirty) || isSubmitting}
                text={isSubmitting ? "Signing Up..." : "Sign Up."}
                btnclass={`font-semibold rounded-md text-white text-lg px-6 py-3 mt-2 ${
                  !isValid ? "bg-red-200" : "bg-red-600"
                }`}
              />
            </Form>
          )}
        </Formik>
      )}
    </AuthLayout>
  );
};

export default Signup;
