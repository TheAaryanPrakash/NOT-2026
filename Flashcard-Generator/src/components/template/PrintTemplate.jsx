// print template page

import React from "react";

const PrintTemplate = ({ pdfRef, flashcard }) => {
  if (!flashcard) return null;

  return (
    <div className="hidden">
      <div
        ref={pdfRef}
        key={flashcard.id}
        className="bg-white p-4 sm:p-8 max-w-4xl"
      >
        <div className="space-y-10">
          <div className="flex items-center flex-col md:flex-row gap-5 sm:flex-row">
            <div>
              <img
                src={flashcard.image_url}
                alt="Group_image"
                className="w-52 aspect-square rounded-md object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-center sm:text-left">
                {flashcard.name}
              </h2>
              <p className="text-gray-600">{flashcard.description}</p>
            </div>
          </div>

          <div>
            <ul className="space-y-6 flex flex-col">
              {flashcard.flashcard_terms.map(
                ({ term, definition, image_url }, index) => (
                  <li key={index}>
                    <div className="flex gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full aspect-square bg-blue-500 text-white grid place-items-center">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold">{term}</h3>
                    </div>

                    <div className="text-center">
                      <div>
                        <img
                          src={image_url}
                          alt="Group_image"
                          className="w-40 aspect-square object-cover rounded-md float-left mr-2 mb-2 mt-2"
                        />
                      </div>
                      <div>
                        <p className="text-gray-600 text-justify">
                          {definition}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintTemplate;
