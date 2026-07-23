// create group and group description page for the flashcard app

import React from "react";
import FieldInput from "./ui/input/FieldInput";
import { Field } from "formik";
import { AiFillFileImage } from "react-icons/ai";
import Button from "./ui/button/Button";

const CreateGroup = ({ values, setFieldValue }) => {
  // This function returns a `div` element that contains the create group and group description form.
  return (
    <div className="bg-brandSurface shadow-md md:p-10 p-5 rounded-md sm:p-5">
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
              "border-2 border-brandBorder text-white rounded-md min-w-max font-semibold text-lg px-6 py-2 hover:border-brandAqua transition-all"
            }
            text={
              <>
                <label
                  htmlFor="profile"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <AiFillFileImage className="text-brandAqua" />
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
        {values.groups.Profile && (
          <>
            <div className="flex items-center gap-5">
              <img
                className="w-20 aspect-square rounded-md"
                src={values.groups.Profile}
                alt="card_profile"
                loading="lazy"
              />
              <Button
                type="button"
                btnclass={"font-semibold text-brandAqua mt-5"}
                fn={() => {
                  setFieldValue("groups.Profile", null);
                  setFieldValue("groups.ProfileFile", null);
                }}
                text={"- Remove"}
                list
              />
            </div>
          </>
        )}
      </div>
      {/* Group description */}
      <div className="flex flex-col gap-2 relative">
        <label
          htmlFor="groupDescription"
          className="font-semibold text-gray-300"
        >
          Add Description
        </label>
        <Field
          as="textarea"
          name={`groups.groupDesc`}
          id="groupDescription"
          maxLength="500"
          placeholder="Write your description here ( max length is 500 words )"
          className="p-2 text-lg border-2 border-brandBorder bg-black text-white placeholder-gray-500 rounded-md h-36 resize-none focus:outline-none focus:border-brandAqua"
        />
      </div>
    </div>
  );
};

export default CreateGroup;
