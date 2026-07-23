import { lazy } from "react";
const NotFound = lazy(() => import("../pages/errors/NotFound"));
const CreateFlashcard = lazy(() => import("../pages/home/CreateFlashcard"));
const EditFlashcard = lazy(() => import("../pages/EditFlashcard"));
const FlashcardDetails = lazy(() => import("../pages/FlashcardDetails"));
const MyFlashcard = lazy(() => import("../pages/MyFlashcard"));
const Quiz = lazy(() => import("../pages/Quiz"));

const PageRoutes = [
  {
    path: "/",
    element: <CreateFlashcard />,
  },
  {
    path: "/dashboard",
    element: <MyFlashcard />,
  },
  {
    path: "dashboard/:id",
    element: <FlashcardDetails />,
  },
  {
    path: "dashboard/:id/edit",
    element: <EditFlashcard />,
  },
  {
    path: "dashboard/:id/quiz",
    element: <Quiz />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default PageRoutes;
