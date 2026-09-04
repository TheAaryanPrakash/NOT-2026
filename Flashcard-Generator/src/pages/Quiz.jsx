import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../components/ui/spinner/Spinner";
import Button from "../components/ui/button/Button";
import { useFlashcardGroup } from "../hooks/useFlashcards";
import { useCreateQuizAttempt } from "../hooks/useQuiz";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildQuestions = (terms) =>
  shuffle(terms).map((current) => {
    const distractors = shuffle(
      terms.filter((t) => t !== current)
    ).slice(0, 3);

    return {
      term: current.term,
      correctDefinition: current.definition,
      choices: shuffle([current.definition, ...distractors.map((d) => d.definition)]),
    };
  });

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: flashcard, isLoading, isError } = useFlashcardGroup(id);
  const { mutate: saveAttempt } = useCreateQuizAttempt(id);

  const questions = useMemo(
    () => (flashcard ? buildQuestions(flashcard.flashcard_terms) : []),
    [flashcard]
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);

  if (isLoading) return <Spinner />;

  if (isError || !flashcard) {
    return (
      <p className="text-center text-gray-400">
        Couldn't load this flashcard set.
      </p>
    );
  }

  if (flashcard.flashcard_terms.length < 2) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-5">
          Add at least 2 terms to this set before taking a quiz.
        </p>
        <Link
          to={`/app/dashboard/${id}`}
          className="text-brandCyan font-semibold hover:text-white transition-colors"
        >
          Back to flashcard set
        </Link>
      </div>
    );
  }

  const question = questions[index];

  const handleAnswer = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === question.correctDefinition) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }

    setFinished(true);
    if (!saved) {
      saveAttempt({ score, total: questions.length });
      setSaved(true);
    }
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center flex flex-col items-center gap-3"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500">
          Quiz complete
        </p>
        <motion.p
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
          className="font-display text-7xl md:text-8xl font-bold tracking-tight text-brandCyan leading-none"
        >
          {score}
          <span className="text-white/30">/{questions.length}</span>
        </motion.p>
        <p className="text-gray-400 mb-2">
          {Math.round((score / questions.length) * 100)}% correct
        </p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            text="Retake Quiz"
            fn={() => navigate(0)}
            btnclass="px-6 py-2.5 bg-brandCyan hover:bg-white text-black rounded-xl font-semibold transition-colors"
          />
          <Link
            to={`/app/dashboard/${id}`}
            className="px-6 py-2.5 border border-brandBorder rounded-xl font-semibold hover:border-brandCyan transition-colors"
          >
            Back to Set
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-5 mb-8">
        <Link to={`/app/dashboard/${id}`}>
          <i className="text-xl text-brandCyan">
            <BsArrowLeft />
          </i>
        </Link>
        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight capitalize text-white">
          {flashcard.name} &mdash; Quiz
        </h3>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-[0.2em]">
            Question {String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
          </p>
        </div>
        <div className="h-1 bg-brandBorder rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-brandCyan rounded-full"
            initial={false}
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-brandSurface border border-brandBorder p-6 rounded-xl shadow-sm mb-6">
              <h4 className="font-display text-2xl font-bold tracking-tight text-white">{question.term}</h4>
            </div>

            <div className="flex flex-col gap-3">
              {question.choices.map((choice, i) => {
                const isCorrect = choice === question.correctDefinition;
                const isSelected = choice === selected;

                let stateClass = "bg-brandSurface border-brandBorder hover:border-brandCyan/50";
                if (selected) {
                  if (isCorrect)
                    stateClass = "bg-brandCyan/10 border-brandCyan text-white";
                  else if (isSelected)
                    stateClass = "bg-brandRed/10 border-brandRed/60 text-brandRed";
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(choice)}
                    whileHover={!selected ? { scale: 1.015 } : undefined}
                    whileTap={!selected ? { scale: 0.985 } : undefined}
                    animate={isSelected && !isCorrect ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`text-left p-4 rounded-xl border shadow-sm transition-colors ${stateClass}`}
                  >
                    {choice}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <Button
                type="button"
                text={index + 1 < questions.length ? "Next Question" : "See Results"}
                fn={handleNext}
                btnclass="px-8 py-3 bg-brandCyan hover:bg-white text-black rounded-xl font-semibold transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
