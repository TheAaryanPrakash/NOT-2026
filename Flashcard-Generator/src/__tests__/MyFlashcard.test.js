import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "@testing-library/jest-dom";
import MyFlashcard from "../pages/MyFlashcard";

jest.mock("../hooks/useFlashcards", () => ({
  useFlashcardGroups: () => ({
    data: [
      {
        id: "dummy-id-1",
        name: "Dummy text group",
        description: "Lorem ipsum",
        image_url: "Lorem profile",
        flashcard_terms: [
          {
            term: "Lorem ipsum dolor",
            definition:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            image_url: "Lorem image",
          },
        ],
      },
    ],
    isLoading: false,
    isError: false,
  }),
  useDeleteFlashcardGroup: () => ({ mutate: jest.fn() }),
}));

describe("MyFlashcard", () => {
  let component;
  beforeEach(() => {
    const queryClient = new QueryClient();

    // eslint-disable-next-line testing-library/no-render-in-setup
    component = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <MyFlashcard />
        </QueryClientProvider>
      </BrowserRouter>
    );
  });
  it("Card should be render", () => {
    const { getByTestId, getByText } = component;
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText("Dummy text group")).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByTestId("container")).toBeInTheDocument();
  });
});
