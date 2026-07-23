import React from "react";
import Card from "../components/ui/card/Card";
import { NavLink } from "react-router-dom";
import Spinner from "../components/ui/spinner/Spinner";
import { useFlashcardGroups } from "../hooks/useFlashcards";

const MyFlashcard = () => {
  const { data: flashcards = [], isLoading, isError } = useFlashcardGroups();

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <p className="text-center text-gray-500">
        Couldn't load your flashcards. Try refreshing the page.
      </p>
    );
  }

  return (
    <div
      className="flex gap-3 flex-wrap mx-auto "
      data-testid="container"
      role="main"
    >
      {flashcards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center mx-auto">
          <p className="text-black text-2xl">You don't have any flashcards</p>
          <NavLink
            role="link"
            to={"/app"}
            data-testid="navigation"
            name="Create Flashcard"
            className={
              "px-6 py-2 bg-red-500 rounded-md text-xl font-semibold text-white hover:bg-red-700 transition-all"
            }
          >
            Create Flashcard
          </NavLink>
        </div>
      ) : (
        flashcards.map(({ id, name, description, flashcard_terms, image_url }) => (
          <Card
            dataTestid="flashcard"
            key={id}
            id={id}
            group={name}
            groupDesc={description}
            terms={flashcard_terms}
            image={image_url}
          />
        ))
      )}
    </div>
  );
};

export default MyFlashcard;
