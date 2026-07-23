import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import FlashcardForm from "../components/FlashcardForm";
import Spinner from "../components/ui/spinner/Spinner";
import {
  useFlashcardGroup,
  useUpdateFlashcardGroup,
} from "../hooks/useFlashcards";

const toFormValues = (group) => ({
  groups: {
    group: group.name,
    groupDesc: group.description || "",
    Profile: group.image_url,
    ProfileFile: null,
  },
  terms: group.flashcard_terms.map(({ term, definition, image_url }) => ({
    term,
    definition,
    image: image_url,
    imageFile: null,
  })),
});

const EditFlashcard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: group, isLoading, isError } = useFlashcardGroup(id);
  const { mutateAsync: updateFlashcardGroup } = useUpdateFlashcardGroup(id);

  if (isLoading) return <Spinner />;

  if (isError || !group) {
    return (
      <p className="text-center text-gray-500">
        Couldn't load this flashcard set.
      </p>
    );
  }

  return (
    <FlashcardForm
      initialValues={toFormValues(group)}
      submitLabel="Save Changes"
      resetOnSuccess={false}
      onSubmit={async (values) => {
        await updateFlashcardGroup(values);
        navigate(`/app/dashboard/${id}`);
      }}
    />
  );
};

export default EditFlashcard;
