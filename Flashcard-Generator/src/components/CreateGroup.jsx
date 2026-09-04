// create group and group description page for the flashcard app

import React from "react";
import FieldInput from "./ui/input/FieldInput";
import { Field } from "formik";
import { AiFillFileImage } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./ui/button/Button";

const CreateGroup = ({ values, setFieldValue }) => {
  // This function returns a `div` element that contains the create group and group description form.
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-brandSurface shadow-md md:p-10 p-5 rounded-xl sm:p-5"
    >
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-brandBorder">
        <span className="font-mono text-xs text-brandCyan">01</span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Details
        </span>
      </div>
      {/* This `div` element contains the group name input and the group image
      upload button. */}
      <div
        className={`flex items-end gap-5 mb-5 sm:flex-row flex-col flex-wrap`}
      >
        {/* Enter group input */}
        <FieldInput
          name={`groups.group`}
          id={"group"}
          htmlFor={"group"}
          label={"Create Group"}
          placeholder={"Organic Chemistry"}
        />

        <div>
          {/* Button for uploading Group image */}
          <Button
            type={"button"}
            btnclass={
              "border border-brandBorder text-white rounded-lg min-w-max font-semibold text-sm px-5 py-2.5 hover:border-brandCyan transition-colors"
            }
            text={
              <>
                <label
                  htmlFor="profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <AiFillFileImage className="text-brandCyan" />
                  {values.groups.Profile ? "Change" : "Upload"} Image
                  <Field
                    type="file"
                    id="profile"
                    name={`groups.profile`}
                    hidden
                    value=""
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setFieldValue("groups.Profile", URL.createObjectURL(file));
                      setFieldValue("groups.ProfileFile", file);
                    }}
                  />
                </label>
              </>
            }
          />
        </div>
        <AnimatePresence>
          {values.groups.Profile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="flex items-center gap-5"
            >
              <img
                className="w-20 aspect-square rounded-lg ring-1 ring-brandBorder"
                src={values.groups.Profile}
                alt="card_profile"
                loading="lazy"
              />
              <Button
                type="button"
                btnclass={"font-semibold text-sm text-brandCyan hover:text-white transition-colors mt-5"}
                fn={() => {
                  setFieldValue("groups.Profile", null);
                  setFieldValue("groups.ProfileFile", null);
                }}
                text={"- Remove"}
                list
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Group description */}
      <div className="flex flex-col gap-2 relative">
        <label
          htmlFor="groupDescription"
          className="font-medium text-sm text-gray-400"
        >
          Add Description
        </label>
        <Field
          as="textarea"
          name={`groups.groupDesc`}
          id="groupDescription"
          maxLength="500"
          placeholder="Write your description here ( max length is 500 words )"
          className="p-2.5 text-base border border-brandBorder bg-brandBg text-white placeholder-gray-600 rounded-lg h-36 resize-none transition-colors focus:outline-none focus:border-brandCyan focus:ring-1 focus:ring-brandCyan/50"
        />
      </div>
    </motion.div>
  );
};

export default CreateGroup;
