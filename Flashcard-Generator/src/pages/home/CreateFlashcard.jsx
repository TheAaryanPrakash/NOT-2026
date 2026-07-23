// page for creating flashcards

import React from "react";
import FlashcardForm from "../../components/FlashcardForm";
import { useCreateFlashcardGroup } from "../../hooks/useFlashcards";

const emptyValues = {
  groups: {
    group: "",
    groupDesc: "",
    Profile: null,
    ProfileFile: null,
  },
  terms: [
    {
      term: "",
      definition: "",
      image: null,
      imageFile: null,
    },
  ],
};

const CreateFlashcard = () => {
  const { mutateAsync: createFlashcardGroup } = useCreateFlashcardGroup();

  return (
    <FlashcardForm
      initialValues={emptyValues}
      submitLabel="Create Flashcard"
      onSubmit={(values) => createFlashcardGroup(values)}
    />
  );
};

export default CreateFlashcard;
