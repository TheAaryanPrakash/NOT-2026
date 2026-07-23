import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft, BsDownload, BsPrinter, BsQuestionCircle } from "react-icons/bs";
import { CiShare2 } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
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
      btn_icon: <CiShare2 className="text-blue-600" />,
      btn_text: "Share",
      btn_fn: () => {
        setToggleModal("grid");
      },
    },
    {
      btn_id: 2,
      btn_title: "download as PDF",
      btn_icon: <BsDownload className="text-blue-600" />,
      btn_text: "Download",
      btn_fn: downloadPDF,
    },
    {
      btn_id: 3,
      btn_title: "print",
      btn_icon: <BsPrinter className="text-blue-600" />,
      btn_text: "Print",
      btn_fn: useReactToPrint({
        content: () => termRef.current,
      }),
    },
    {
      btn_id: 4,
      btn_title: "take a quiz on this set",
      btn_icon: <BsQuestionCircle className="text-blue-600" />,
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
      <p className="text-center text-gray-500">
        Couldn't find this flashcard set.
      </p>
    );
  }

  return (
    <div>
      <ShareModal show={toggleModal} hide={setToggleModal} flashcard={flashcard} />
      <PrintTemplate pdfRef={pdfRef} flashcard={flashcard} />

      <div className="flex items-start gap-5 mb-10">
        <div>
          <Link to="/app/dashboard">
            <i className="text-xl text-red-600">
              <BsArrowLeft />
            </i>
          </Link>
        </div>
        <div className="flex-1 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold leading-none capitalize mb-2">
              {flashcard.name}
            </h3>
            <p>{flashcard.description}</p>
          </div>
          <Link
            to={`/app/dashboard/${id}/edit`}
            title="edit this flashcard set"
            className="flex items-center gap-2 text-blue-600 font-semibold"
          >
            <BiEdit /> Edit
          </Link>
        </div>
      </div>

      <div className="xl:flex xl:gap-3 xl:items-start">
        <div className="bg-white p-4 rounded-md max-h-96">
          <h5 className="text-gray-500 border-b-2 border-b-gray-100 font-semibold">
            Flashcards
          </h5>
          <ul className="flex gap-3 mt-4 font-medium text-gray-600 xl:overflow-y-scroll max-h-80 pb-5 overflow-x-scroll xl:flex-col xl:w-52 xl:overflow-x-auto">
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
                  <li key={index} className="border-b border-gray-100">
                    <button
                      type="button"
                      ref={isButtonRef}
                      onClick={handleClick}
                      className={`text-left w-52 bg-gray-200 p-3 rounded-md shadow-sm truncate xl:w-full xl:bg-transparent xl:p-0 xl:pb-1 transition-all ${
                        isActive ? "xl:text-blue-500 text-blue-500" : ""
                      }`}
                    >
                      {term}
                    </button>
                  </li>
                );
              }
            )}
          </ul>
        </div>
        <div className="space-y-10 w-full mb-10" id="myId">
          <Slider
            key={id}
            definition={state.definition}
            image={state.image}
            term={state.term}
            termRef={termRef}
          />

          <div className="flex items-center gap-8 justify-center">
            <Button
              type={"button"}
              text={<GrPrevious />}
              fn={() => displayData(active - 1)}
              btnclass={"p-2 rounded-md active:bg-blue-100 hover:bg-gray-200"}
            />
            <span>
              {state.index + 1}/{state.totalTerms}
            </span>
            <Button
              type={"button"}
              text={<GrNext />}
              fn={() => displayData(active + 1)}
              btnclass={"p-2 rounded-md active:bg-blue-100 hover:bg-gray-200"}
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
                    btnclass="flex items-center gap-2 bg-white rounded-md w-full shadow-sm transition-all px-6 py-2"
                  />
                </li>
              )
            )}
          </ul>

          {quizAttempts.length > 0 && (
            <div className="bg-white rounded-md shadow-sm mt-3 p-4 xl:w-52">
              <h5 className="text-gray-500 font-semibold mb-2">
                Quiz History
              </h5>
              <ul className="flex flex-col gap-1 text-sm text-gray-600">
                {quizAttempts.slice(0, 5).map(({ id: attemptId, score, total, created_at }) => (
                  <li key={attemptId} className="flex justify-between gap-3">
                    <span>{new Date(created_at).toLocaleDateString()}</span>
                    <span className="font-semibold">
                      {score}/{total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardDetails;
