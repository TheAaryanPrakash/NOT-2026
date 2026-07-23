import React from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/ui/spinner/Spinner";
import dummyImage from "../assets/dummy_image.jpg";
import { usePublicFlashcardGroup } from "../hooks/useFlashcards";

const SharedFlashcard = () => {
  const { id } = useParams();
  const { data: flashcard, isLoading, isError } = usePublicFlashcardGroup(id);

  if (isLoading) return <Spinner />;

  if (isError || !flashcard) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 text-center px-5">
        <h2 className="text-3xl font-bold">
          This flashcard set isn't available
        </h2>
        <p className="text-gray-400">
          It may have been made private or deleted by its owner.
        </p>
        <Link to="/" className="text-brandAqua font-semibold">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <div className="max-w-screen-md mx-auto px-5 pt-10">
        <div className="flex items-center gap-5 mb-10 bg-brandSurface p-5 rounded-md shadow-sm">
          <img
            className="w-16 h-16 object-cover rounded-full"
            src={flashcard.image_url || dummyImage}
            alt="flashcard-profile"
          />
          <div>
            <h1 className="text-2xl font-bold capitalize text-brandAqua">
              {flashcard.name}
            </h1>
            <p className="text-gray-300">{flashcard.description}</p>
            <p className="text-gray-500 text-sm mt-1">
              {flashcard.flashcard_terms.length}{" "}
              {flashcard.flashcard_terms.length === 1 ? "term" : "terms"} &middot;
              shared by a NOT. user
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-4">
          {flashcard.flashcard_terms.map(({ term, definition, image_url }, index) => (
            <li key={index} className="bg-brandSurface p-5 rounded-md shadow-sm">
              {image_url && (
                <img
                  src={image_url}
                  alt={term}
                  loading="lazy"
                  className="sm:w-64 sm:float-left sm:mr-4 sm:mb-2 aspect-video w-full object-cover rounded-md"
                />
              )}
              <h3 className="font-semibold text-lg mb-1">{term}</h3>
              <p className="text-gray-300">{definition}</p>
            </li>
          ))}
        </ul>

        <div className="text-center mt-10">
          <Link to="/signup" className="text-brandAqua font-semibold">
            Create your own flashcards with NOT.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedFlashcard;
