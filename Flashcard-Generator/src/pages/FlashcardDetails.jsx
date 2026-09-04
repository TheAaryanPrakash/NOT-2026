import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft, BsDownload, BsPrinter, BsQuestionCircle } from "react-icons/bs";
import { CiShare2 } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../components/ui/button/Button";
import { GrNext, GrPrevious } from "react-icons/gr";
import ShareModal from "../components/ui/modal/ShareModal";
import Slider from "../components/ui/slider/Slider";
import PrintTemplate from "../components/template/PrintTemplate";
import Spinner from "../components/ui/spinner/Spinner";
import { useFlashcardGroup } from "../hooks/useFlashcards";
import { useQuizAttempts } from "../hooks/useQuiz";
import { useReactToPrint } from "react-to-print";

const FlashcardDetails = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [toggleModal, setToggleModal] = useState("hidden");
  const { data: flashcard, isLoading, isError } = useFlashcardGroup(id);
  const { data: quizAttempts = [] } = useQuizAttempts(id);

  const pdfRef = useRef();
  const downloadPDF = useReactToPrint({
    content: () => pdfRef.current,
  });

  const termRef = useRef();

  const SideBtnData = [
    {
      btn_id: 1,
      btn_title: "share the webpage",
      btn_icon: <CiShare2 className="text-brandAqua" />,
      btn_text: "Share",
      btn_fn: () => {
        setToggleModal("grid");
      },
    },
    {
      btn_id: 2,
      btn_title: "download as PDF",
      btn_icon: <BsDownload className="text-brandAqua" />,
      btn_text: "Download",
      btn_fn: downloadPDF,
    },
    {
      btn_id: 3,
      btn_title: "print",
      btn_icon: <BsPrinter className="text-brandAqua" />,
      btn_text: "Print",
      btn_fn: useReactToPrint({
        content: () => termRef.current,
      }),
    },
    {
      btn_id: 4,
      btn_title: "take a quiz on this set",
      btn_icon: <BsQuestionCircle className="text-brandAqua" />,
      btn_text: "Quiz Me",
      btn_fn: () => navigate(`/app/dashboard/${id}/quiz`),
    },
  ];

  const [state, setState] = useState({
    term: "",
    definition: "",
    image: "",
    index: 0,
    totalTerms: 0,
  });

  const [active, setActive] = useState(null);

  const fetchTermData = (term, definition, image, index, totalTerms) =>
    setState({ term, definition, image, index, totalTerms });

  const buttonRef = useRef();

  useEffect(() => {
    if (flashcard && buttonRef.current) {
      buttonRef.current.click();
    }
  }, [flashcard]);

  const displayData = (newInd) => {
    if (!flashcard) return;
    flashcard.flashcard_terms.forEach(
      ({ term, definition, image_url }, index, arr) => {
        if (Number(newInd) === index) {
          setActive(newInd);
          fetchTermData(term, definition, image_url, index, arr.length);
        }
      }
    );
  };

  if (isLoading) return <Spinner />;

  if (isError || !flashcard) {
    return (
      <p className="text-center text-gray-400">
        Couldn't find this flashcard set.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ShareModal show={toggleModal} hide={setToggleModal} flashcard={flashcard} />
      <PrintTemplate pdfRef={pdfRef} flashcard={flashcard} />

      <div className="flex items-start gap-5 mb-10">
        <div>
          <Link to="/app/dashboard">
            <i className="text-xl text-brandCyan">
              <BsArrowLeft />
            </i>
          </Link>
        </div>
        <div className="flex-1 flex items-start justify-between">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-none capitalize mb-3 text-white">
              {flashcard.name}
            </h3>
            <p className="text-gray-400 text-sm">{flashcard.description}</p>
          </div>
          <Link
            to={`/app/dashboard/${id}/edit`}
            title="edit this flashcard set"
            className="flex items-center gap-2 text-brandCyan font-semibold text-sm hover:text-white transition-colors"
          >
            <BiEdit /> Edit
          </Link>
        </div>
      </div>

      <div className="xl:flex xl:gap-3 xl:items-start">
        <div className="bg-brandSurface border border-brandBorder p-4 rounded-xl max-h-96">
          <div className="flex items-center gap-3 pb-2 border-b border-brandBorder">
            <span className="font-mono text-xs text-brandCyan">{flashcard.flashcard_terms.length}</span>
            <h5 className="text-gray-500 text-xs uppercase tracking-[0.2em] font-semibold">
              Flashcards
            </h5>
          </div>
          <ul className="flex gap-3 mt-4 font-medium text-gray-300 xl:overflow-y-scroll max-h-80 pb-5 overflow-x-scroll snap-x snap-mandatory xl:flex-col xl:w-52 xl:overflow-x-auto xl:snap-none">
            {flashcard.flashcard_terms.map(
              ({ term, definition, image_url }, index) => {
                const isButtonRef = index === 0 ? buttonRef : null;
                const isActive = active === index;
                const handleClick = () => {
                  setActive(index);
                  fetchTermData(
                    term,
                    definition,
                    image_url,
                    index,
                    flashcard.flashcard_terms.length
                  );
                };

                return (
                  <li key={index} className="relative snap-start border-b border-brandBorder xl:border-b-0">
                    {isActive && (
                      <motion.span
                        layoutId="active-term-highlight"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-brandCyan/10 rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      ref={isButtonRef}
                      onClick={handleClick}
                      className={`relative flex items-center gap-2 text-left w-52 bg-brandBg p-3 rounded-lg shadow-sm xl:w-full xl:bg-transparent xl:p-2 transition-colors ${
                        isActive ? "text-brandCyan" : "hover:text-white"
                      }`}
                    >
                      <span className="font-mono text-xs text-gray-600 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{term}</span>
                    </button>
                  </li>
                );
              }
            )}
          </ul>
        </div>
        <div className="space-y-10 w-full mb-10" id="myId">
          <AnimatePresence mode="wait">
            <Slider
              key={active}
              definition={state.definition}
              image={state.image}
              term={state.term}
              termRef={termRef}
            />
          </AnimatePresence>

          <div className="flex items-center gap-4 justify-center">
            <Button
              type={"button"}
              text={<GrPrevious />}
              fn={() => displayData(active - 1)}
              btnclass={"p-3 rounded-full border border-brandBorder text-gray-400 hover:border-brandCyan/50 hover:text-white transition-colors"}
            />
            <span className="font-mono text-sm text-gray-400 tabular-nums px-4 py-2 rounded-full border border-brandBorder">
              <span className="text-white font-semibold">
                {String(state.index + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(state.totalTerms).padStart(2, "0")}
            </span>
            <Button
              type={"button"}
              text={<GrNext />}
              fn={() => displayData(active + 1)}
              btnclass={"p-3 rounded-full border border-brandBorder text-gray-400 hover:border-brandCyan/50 hover:text-white transition-colors"}
            />
          </div>
        </div>
        <div>
          <ul className="flex gap-3 overflow-x-scroll xl:flex-col xl:overflow-x-auto">
            {SideBtnData.map(
              ({ btn_icon, btn_text, btn_title, btn_id, btn_fn }) => (
                <li key={btn_id}>
                  <Button
                    fn={btn_fn}
                    type={"button"}
                    title={`Click here to ${btn_title}`}
                    text={
                      <>
                        {btn_icon}
                        {btn_text}
                      </>
                    }
                    btnclass="flex items-center gap-2 bg-brandSurface border border-brandBorder rounded-lg w-full shadow-sm transition-colors text-sm font-medium px-6 py-2.5 hover:border-brandCyan/50"
                  />
                </li>
              )
            )}
          </ul>

          {quizAttempts.length > 0 && (
            <div className="bg-brandSurface border border-brandBorder rounded-lg shadow-sm mt-3 p-4 xl:w-52">
              <h5 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                Quiz History
              </h5>
              <ul className="flex flex-col gap-1 text-sm text-gray-300 font-mono">
                {quizAttempts.slice(0, 5).map(({ id: attemptId, score, total, created_at }) => (
                  <li key={attemptId} className="flex justify-between gap-3">
                    <span className="font-sans text-gray-500">{new Date(created_at).toLocaleDateString()}</span>
                    <span className="font-semibold text-brandCyan">
                      {score}/{total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlashcardDetails;
