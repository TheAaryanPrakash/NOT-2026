import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { TbTrashX } from "react-icons/tb";
import { Link } from "react-router-dom";
import dummyImage from "../../../assets/dummy_image.jpg";
import Button from "../button/Button";
import { useDeleteFlashcardGroup } from "../../../hooks/useFlashcards";

const Card = ({ group, groupDesc, terms, image, id }) => {
  const { mutate: deleteFlashcardGroup } = useDeleteFlashcardGroup();

  return (
    <div
      className="sm:w-72 w-full md:w-80 lg:w-80 mx-auto sm:mx-0 bg-brandSurface border border-gray-800 shadow-sm rounded-md p-5 pt-8 flex flex-col justify-between text-white"
      id={id}
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14">
          <img
            className="w-14 h-14 min-w-max object-cover aspect-square rounded-full"
            src={!image ? dummyImage : image}
            alt="flashcard-profile"
            title="flashcard-profile"
            loading="lazy"
          />
        </div>
        <div className="break-words line-clamp-1">
          <h2 className="font-bold text-lg break-words line-clamp-1">
            {group}
          </h2>
          <span className="text-gray-400 font-semibold">
            {terms.length} {terms.length <= 1 ? "Term" : "Terms"}
          </span>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <p className="text-gray-400 line-clamp-2">{groupDesc}</p>
        <div className="flex items-center justify-between">
        <Link
          to={`/app/dashboard/${id}`}
          className="flex items-center gap-5 text-brandAqua font-semibold"
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
            className="p-1 rounded-md text-brandAqua text-xl transition-all bg-brandAqua/10 hover:bg-brandAqua/20 active:bg-brandAqua/30"
          >
            <BiEdit />
          </Link>
          <Button
            type={"button"}
            text={<TbTrashX />}
            fn={() => deleteFlashcardGroup(id)}
            btnclass={
              "p-1 rounded-md text-red-500 text-xl transition-all bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30"
            }
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Card;
