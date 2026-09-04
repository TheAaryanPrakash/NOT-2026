import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import CreateTerm from "./CreateTerm";
import AiGenerator from "./AiGenerator";
import { Formik, Form } from "formik";
import { AnimatePresence, motion } from "framer-motion";
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
  enableAiGenerate = false,
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
            <AnimatePresence>
              {toast && <Toast fn={() => setToast(false)} />}
            </AnimatePresence>

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

            {enableAiGenerate && (
              <AiGenerator setFieldValue={setFieldValue} />
            )}

            <CreateGroup values={values} setFieldValue={setFieldValue} />
            <CreateTerm setFieldValue={setFieldValue} values={values} />
          </section>

          <div className="mx-auto text-center">
            <Button
              data-testid="submit-form"
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
              btnclass={`font-semibold rounded-xl text-lg px-14 py-4 transition-colors ${
                !(isValid && dirty)
                  ? "bg-brandBorder text-gray-500"
                  : "bg-brandCyan text-black hover:bg-white shadow-glow"
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
