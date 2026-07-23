import React from "react";
import { AiFillFileImage } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { TbTrashX } from "react-icons/tb";
import Button from "./ui/button/Button";
import FieldInput from "./ui/input/FieldInput";
import { FieldArray } from "formik";

const CreateTerm = ({ values, setFieldValue }) => {
  
  return (
    <div className={!values.groups.group && "opacity-50 pointer-events-none"}>
      <FieldArray
        name="terms"
        render={(arrayHelpers) => (
          <ul className="bg-brandSurface md:p-10 rounded-md sm:p-5 p-5 shadow-md flex flex-col gap-8">
            {values.terms.map((item, index) => (
              <li
                key={index}
                className="flex gap-5 items-start md:flex-row flex-col sm:flex-col sm:w-full"
              >
                <span className="px-4 py-2 text-xl font-bold rounded-full bg-red-600 text-white">
                  {index + 1}
                </span>
                <div className="flex items-end flex-wrap gap-5 md:flex-row sm:flex-col flex-col w-full">
                  <FieldInput
                    name={`terms.${index}.term`}
                    htmlFor={`Term${index}`}
                    label={"Enter Term"}
                    id={`Term${index}`}
                    placeholder={"What is ISP?"}
                  />
                  <FieldInput
                    name={`terms.${index}.definition`}
                    htmlFor={`Definition${index}`}
                    label={"Enter Definition"}
                    id={`Definition${index}`}
                    placeholder={"An ISP (internet service provider) is..."}
                  />
                  {!item.image && (
                    <div>
                      <Button
                        type={"button"}
                        btnclass={
                          "border-2 border-brandBorder text-white rounded-md min-w-max font-semibold text-lg px-6 py-2 hover:border-brandAqua transition-all"
                        }
                        text={
                          <>
                            <label
                              htmlFor={`cardImage-${index}`}
                              className="flex items-center cursor-pointer"
                            >
                              <AiFillFileImage className="text-brandAqua" />
                              Upload Image
                              <input
                                type="file"
                                id={`cardImage-${index}`}
                                hidden
                                accept="image/*"
                                 onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  arrayHelpers.replace(index, {
                                    ...item,
                                    image: URL.createObjectURL(file),
                                    imageFile: file,
                                  });
                                }}
                              />
                            </label>
                          </>
                        }
                      />
                    </div>
                  )}
                  {item.image && (
                    <div className="flex items-center gap-5">
                      <div>
                        <img
                          className="w-20 aspect-square rounded-md"
                          src={item.image}
                          alt="term_image"
                          loading="lazy"
                        />
                      </div>

                      {
                        <div className="flex flex-col gap-5">
                          <Button
                            type={"button"}
                            text={
                              <TbTrashX className="text-3xl text-red-500 " />
                            }
                            fn={() => {
                              setFieldValue(`terms.${index}.image`, "");
                              setFieldValue(`terms.${index}.imageFile`, null);
                            }}
                          />

                          <Button
                            type={"button"}
                            text={
                              <label
                                htmlFor={`cardImage-${index}`}
                                className="flex items-center cursor-pointer"
                              >
                                <BiEdit className="text-brandAqua text-3xl cursor-pointer" />
                                <input
                                  type="file"
                                  id={`cardImage-${index}`}
                                  hidden
                                  accept="image/*"
                                   onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  arrayHelpers.replace(index, {
                                    ...item,
                                    image: URL.createObjectURL(file),
                                    imageFile: file,
                                  });
                                 }}
                                />
                              </label>
                            }
                          />
                        </div>
                      }
                    </div>
                  )}
                  {index !== 0 && (
                    <div>
                      <Button
                        type="button"
                        btnclass={"font-semibold text-brandAqua mt-5"}
                        fn={() => arrayHelpers.remove(index)}
                        text={"- Remove"}
                        list
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}

            <li className="text-center md:text-left">
              <Button
                type="button"
                fn={() => arrayHelpers.push("")}
                btnclass={"font-semibold text-brandAqua mt-5"}
                text={"+ Add more"}
              />
            </li>
          </ul>
        )}
      ></FieldArray>
    </div>
  );
};

export default CreateTerm;
