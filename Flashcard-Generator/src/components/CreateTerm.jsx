import React from "react";
import { AiFillFileImage } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { TbTrashX } from "react-icons/tb";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./ui/button/Button";
import FieldInput from "./ui/input/FieldInput";
import { FieldArray } from "formik";

const CreateTerm = ({ values, setFieldValue }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={!values.groups.group ? "opacity-50 pointer-events-none" : ""}
    >
      <FieldArray
        name="terms"
        render={(arrayHelpers) => (
          <ul className="bg-brandSurface md:p-10 rounded-xl sm:p-5 p-5 shadow-md flex flex-col gap-8">
            <li className="flex items-center gap-3 pb-3 border-b border-brandBorder">
              <span className="font-mono text-xs text-brandCyan">02</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                Terms
              </span>
            </li>
            <AnimatePresence initial={false}>
              {values.terms.map((item, index) => (
              <motion.li
                key={index}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="flex gap-5 items-start md:flex-row flex-col sm:flex-col sm:w-full"
              >
                <span className="px-3.5 py-1.5 text-base font-mono font-semibold rounded-full bg-brandCyan/10 text-brandCyan border border-brandCyan/30">
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
                          "border border-brandBorder text-white rounded-lg min-w-max font-semibold text-sm px-5 py-2.5 hover:border-brandCyan transition-colors"
                        }
                        text={
                          <>
                            <label
                              htmlFor={`cardImage-${index}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <AiFillFileImage className="text-brandCyan" />
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
                          className="w-20 aspect-square rounded-lg ring-1 ring-brandBorder"
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
                              <TbTrashX className="text-2xl text-brandRed" />
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
                                <BiEdit className="text-brandCyan text-2xl cursor-pointer" />
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
                        btnclass={"font-semibold text-sm text-brandCyan hover:text-white transition-colors mt-5"}
                        fn={() => arrayHelpers.remove(index)}
                        text={"- Remove"}
                        list
                      />
                    </div>
                  )}
                </div>
              </motion.li>
              ))}
            </AnimatePresence>

            <li className="text-center md:text-left">
              <Button
                type="button"
                fn={() => arrayHelpers.push("")}
                btnclass={"font-semibold text-sm text-brandCyan hover:text-white transition-colors mt-5"}
                text={"+ Add more"}
              />
            </li>
          </ul>
        )}
      ></FieldArray>
    </motion.div>
  );
};

export default CreateTerm;
