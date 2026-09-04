import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../components/ui/spinner/Spinner";
import dummyImage from "../assets/dummy_image.jpg";
import { usePublicFlashcardGroup } from "../hooks/useFlashcards";

const SharedFlashcard = () => {
  const { id } = useParams();
  const { data: flashcard, isLoading, isError } = usePublicFlashcardGroup(id);

  if (isLoading) return <Spinner />;

  if (isError || !flashcard) {
    return (
      <div className="min-h-screen bg-brandBg text-white flex flex-col items-center justify-center gap-4 text-center px-5 font-sans">
        <h2 className="font-display text-3xl font-semibold">
          This flashcard set isn't available
        </h2>
        <p className="text-gray-400">
          It may have been made private or deleted by its owner.
        </p>
        <Link to="/" className="text-brandCyan font-semibold hover:text-white transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brandBg text-white pb-10 font-sans">
      <div className="max-w-screen-md mx-auto px-5 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-5 mb-10 bg-brandSurface border border-brandBorder p-5 rounded-2xl shadow-sm"
        >
          <img
            className="w-16 h-16 object-cover rounded-full ring-1 ring-brandBorder"
            src={flashcard.image_url || dummyImage}
            alt="flashcard-profile"
          />
          <div>
            <h1 className="font-display text-2xl font-semibold capitalize text-white">
              {flashcard.name}
            </h1>
            <p className="text-gray-400 text-sm">{flashcard.description}</p>
            <p className="text-gray-500 text-xs font-mono mt-1">
              {flashcard.flashcard_terms.length}{" "}
              {flashcard.flashcard_terms.length === 1 ? "term" : "terms"} &middot;
              shared by a NOT. user
            </p>
          </div>
        </motion.div>

        <ul className="flex flex-col gap-4">
          {flashcard.flashcard_terms.map(({ term, definition, image_url }, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + Math.min(index * 0.06, 0.6) }}
              className="bg-brandSurface border border-brandBorder p-5 rounded-xl shadow-sm"
            >
              {image_url && (
                <img
                  src={image_url}
                  alt={term}
                  loading="lazy"
                  className="sm:w-64 sm:float-left sm:mr-4 sm:mb-2 aspect-video w-full object-cover rounded-lg"
                />
              )}
              <h3 className="font-display font-semibold text-lg mb-1 text-brandCyan">{term}</h3>
              <p className="text-gray-300">{definition}</p>
            </motion.li>
          ))}
        </ul>

        <div className="text-center mt-10">
          <Link to="/signup" className="text-brandCyan font-semibold hover:text-white transition-colors">
            Create your own flashcards with NOT.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedFlashcard;
