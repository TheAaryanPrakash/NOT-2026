import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import CreateTerm from "./CreateTerm";
import { Formik, Form } from "formik";
import Button from "./ui/button/Button";
import { flashcardSchema } from "../schema/validation";
import Toast from "./ui/toast/Toast";

// Shared by CreateFlashcard and EditFlashcard. `onSubmit` does the actual
// mutation (create or update) and any post-save navigation; this component
// only owns the form UI, validation, and the success toast.
const FlashcardForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  resetOnSuccess = true,
}) => {
  const [toast, setToast] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={flashcardSchema}
      enableReinitialize
      onSubmit={async (values, actions) => {
        setFormError("");
        try {
          await onSubmit(values);

          if (resetOnSuccess) {
            actions.resetForm();
            setToast(true);
            setTimeout(() => setToast(false), 2000);
          }
        } catch (error) {
          setFormError(error.message || "Something went wrong. Try again.");
        } finally {
          actions.setSubmitting(false);
        }
      }}
      validateOnMount
    >
      {({ values, isValid, setFieldValue, isSubmitting, dirty }) => (
        <Form autoComplete="false">
          <section className="mb-10 flex flex-col gap-10">
            {toast && (
              <Toast
                fn={() => setToast(false)}
                toastClass={!toast ? "-translate-y-96" : "translate-y-0"}
              />
            )}

            {formError && (
              <p className="text-red-600 font-semibold">{formError}</p>
            )}

            <CreateGroup values={values} setFieldValue={setFieldValue} />
            <CreateTerm setFieldValue={setFieldValue} values={values} />
          </section>

          <div className="mx-auto text-center">
            <Button
              data-testid="submit-form"
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
              btnclass={`font-semibold rounded-md text-white text-xl px-14 py-4 ${
                !isValid ? "bg-red-200" : "bg-red-600"
              }`}
              text={isSubmitting ? "Saving..." : submitLabel}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FlashcardForm;
