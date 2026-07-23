import React, { useState } from "react";
import Card from "../components/ui/card/Card";
import { NavLink } from "react-router-dom";
import Spinner from "../components/ui/spinner/Spinner";
import { useFlashcardGroups } from "../hooks/useFlashcards";

const MyFlashcard = () => {
  const { data: flashcards = [], isLoading, isError } = useFlashcardGroups();
  const [search, setSearch] = useState("");

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <p className="text-center text-gray-400">
        Couldn't load your flashcards. Try refreshing the page.
      </p>
    );
  }

  const filteredFlashcards = flashcards.filter(({ name }) =>
    name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      {flashcards.length > 0 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your flashcard sets..."
          aria-label="Search your flashcard sets"
          className="p-2 text-lg border-2 border-brandBorder bg-black text-white placeholder-gray-500 rounded-md w-full max-w-sm mb-6 focus:outline-none focus:border-brandAqua"
        />
      )}

      <div
        className="flex gap-3 flex-wrap mx-auto "
        data-testid="container"
        role="main"
      >
        {flashcards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center mx-auto">
            <p className="text-white text-2xl">You don't have any flashcards</p>
            <NavLink
              role="link"
              to={"/app"}
              data-testid="navigation"
              name="Create Flashcard"
              className={
                "px-6 py-2 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 rounded-md text-xl font-semibold text-white transition-all"
              }
            >
              Create Flashcard
            </NavLink>
          </div>
        ) : filteredFlashcards.length === 0 ? (
          <p className="text-gray-400 mx-auto">
            No flashcard sets match "{search}".
          </p>
        ) : (
          filteredFlashcards.map(
            ({ id, name, description, flashcard_terms, image_url }) => (
              <Card
                dataTestid="flashcard"
                key={id}
                id={id}
                group={name}
                groupDesc={description}
                terms={flashcard_terms}
                image={image_url}
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default MyFlashcard;
