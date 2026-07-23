import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
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
          className="text-brandAqua font-semibold"
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
      <div className="text-center flex flex-col items-center gap-5">
        <h2 className="text-3xl font-bold text-brandAqua">Quiz complete!</h2>
        <p className="text-xl">
          You scored{" "}
          <span className="font-bold text-brandAqua">
            {score}/{questions.length}
          </span>
        </p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            text="Retake Quiz"
            fn={() => navigate(0)}
            btnclass="px-6 py-2 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-md font-semibold transition-all"
          />
          <Link
            to={`/app/dashboard/${id}`}
            className="px-6 py-2 border-2 border-brandBorder rounded-md font-semibold hover:border-brandAqua transition-all"
          >
            Back to Set
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-5 mb-8">
        <Link to={`/app/dashboard/${id}`}>
          <i className="text-xl text-brandAqua">
            <BsArrowLeft />
          </i>
        </Link>
        <h3 className="text-2xl font-semibold capitalize">
          {flashcard.name} &mdash; Quiz
        </h3>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-gray-400 mb-2">
          Question {index + 1}/{questions.length}
        </p>
        <div className="bg-brandSurface p-6 rounded-md shadow-sm mb-6">
          <h4 className="text-xl font-semibold">{question.term}</h4>
        </div>

        <div className="flex flex-col gap-3">
          {question.choices.map((choice, i) => {
            const isCorrect = choice === question.correctDefinition;
            const isSelected = choice === selected;

            let stateClass = "bg-brandSurface border-brandBorder hover:bg-gray-800";
            if (selected) {
              if (isCorrect)
                stateClass = "bg-green-900/40 border-green-500 text-green-300";
              else if (isSelected)
                stateClass = "bg-red-900/40 border-red-500 text-red-300";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(choice)}
                className={`text-left p-4 rounded-md border-2 shadow-sm transition-all ${stateClass}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-6 text-center">
            <Button
              type="button"
              text={index + 1 < questions.length ? "Next Question" : "See Results"}
              fn={handleNext}
              btnclass="px-8 py-3 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-md font-semibold transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
