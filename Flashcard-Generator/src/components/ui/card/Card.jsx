import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { TbTrashX } from "react-icons/tb";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dummyImage from "../../../assets/dummy_image.jpg";
import Button from "../button/Button";
import { useDeleteFlashcardGroup } from "../../../hooks/useFlashcards";

const Card = ({ group, groupDesc, terms, image, id }) => {
  const { mutate: deleteFlashcardGroup } = useDeleteFlashcardGroup();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      whileHover={{ y: -4 }}
      className="sm:w-72 w-full md:w-80 lg:w-80 mx-auto sm:mx-0 bg-brandSurface hover:bg-brandSurfaceHover shadow-sm hover:shadow-glow rounded-xl p-5 pt-8 flex flex-col justify-between text-white transition-colors duration-300"
      id={id}
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14">
          <img
            className="w-14 h-14 min-w-max object-cover aspect-square rounded-full ring-1 ring-brandBorder"
            src={!image ? dummyImage : image}
            alt="flashcard-profile"
            title="flashcard-profile"
            loading="lazy"
          />
        </div>
        <div className="break-words line-clamp-1">
          <h2 className="font-display font-semibold text-lg break-words line-clamp-1">
            {group}
          </h2>
          <span className="text-gray-500 font-medium text-sm font-mono">
            {terms.length} {terms.length <= 1 ? "Term" : "Terms"}
          </span>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <p className="text-gray-400 line-clamp-2 text-sm">{groupDesc}</p>
        <div className="flex items-center justify-between">
        <Link
          to={`/app/dashboard/${id}`}
          className="flex items-center gap-2 text-brandCyan font-semibold text-sm hover:gap-3 transition-all"
          title="view card details"
        >
          View Card
          <i>
            <BsArrowRight />
          </i>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/app/dashboard/${id}/edit`}
            title="edit card"
            className="p-1.5 rounded-md text-brandCyan text-lg transition-colors bg-brandCyan/10 hover:bg-brandCyan/20 active:bg-brandCyan/30"
          >
            <BiEdit />
          </Link>
          <Button
            type={"button"}
            text={<TbTrashX />}
            fn={() => deleteFlashcardGroup(id)}
            btnclass={
              "p-1.5 rounded-md text-brandRed text-lg transition-colors bg-brandRed/10 hover:bg-brandRed/20"
            }
          />
        </div>
      </div>
      </div>
    </motion.div>
  );
};

export default Card;
