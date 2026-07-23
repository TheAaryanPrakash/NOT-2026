import React from "react";
import { BsCheckCircle } from "react-icons/bs";

const Toast = ({ fn, toastClass }) => {
  return (
    <div
      data-testid="toast-dataid"
      className={`p-5 space-y-4 bg-brandSurface border-2 border-brandAqua w-72 sm:w-96 rounded-md text-white fixed top-2 ${toastClass} left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out z-50`}
    >
      <div>
        <h3 className="flex flex-col sm:flex-row items-center gap-2 text-xl font-semibold mb-2 text-brandAqua">
          <i className="text-2xl text-brandAqua">
            <BsCheckCircle />
          </i>
          Your Flashcard is created.
        </h3>
        <p className="text-gray-300">
          Go to My Flashcard tab and check your all of your created flashcards.
        </p>
      </div>
      <div className="text-right">
        <button
          type="button"
          onClick={fn}
          className="font-semibold rounded-md px-4 py-1 text-brandAqua min-w-max hover:bg-brandAqua/10 border-2 border-brandAqua transition-all active:animate-ping"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default Toast;
