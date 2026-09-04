import React, { useState } from "react";
import Card from "../components/ui/card/Card";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

  const totalTerms = flashcards.reduce(
    (sum, { flashcard_terms }) => sum + flashcard_terms.length,
    0
  );

  return (
    <div>
      {flashcards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-end gap-10 mb-8 pb-6 border-b border-brandBorder"
        >
          <div>
            <p className="font-display text-5xl md:text-6xl font-bold text-white leading-none">
              {flashcards.length}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
              {flashcards.length === 1 ? "Set" : "Sets"}
            </p>
          </div>
          <div>
            <p className="font-display text-5xl md:text-6xl font-bold text-brandCyan leading-none">
              {totalTerms}
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
              {totalTerms === 1 ? "Term" : "Terms"}
            </p>
          </div>
        </motion.div>
      )}

      {flashcards.length > 0 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your flashcard sets..."
          aria-label="Search your flashcard sets"
          className="p-2.5 text-base border border-brandBorder bg-brandSurface text-white placeholder-gray-600 rounded-lg w-full max-w-sm mb-6 transition-colors focus:outline-none focus:border-brandCyan focus:ring-1 focus:ring-brandCyan/50"
        />
      )}

      <div
        className="flex gap-4 flex-wrap mx-auto "
        data-testid="container"
        role="main"
      >
        {flashcards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 text-center mx-auto py-16"
          >
            <p className="text-white text-xl font-display">🌙 You don't have any flashcards</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                role="link"
                to={"/app"}
                data-testid="navigation"
                name="Create Flashcard"
                className={
                  "block px-6 py-2.5 bg-brandCyan hover:bg-white rounded-xl text-base font-semibold text-black transition-colors"
                }
              >
                Create Flashcard
              </NavLink>
            </motion.div>
          </motion.div>
        ) : filteredFlashcards.length === 0 ? (
          <p className="text-gray-500 mx-auto">
            No flashcard sets match "{search}".
          </p>
        ) : (
          <AnimatePresence>
            {filteredFlashcards.map(
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
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MyFlashcard;
