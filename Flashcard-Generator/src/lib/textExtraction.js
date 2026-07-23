const extractTextFromPdf = async (file) => {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text.trim();
};

const extractTextFromImage = async (file) => {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(file);
    return text.trim();
  } finally {
    await worker.terminate();
  }
};

// Extracts plain text from a PDF or an image (via OCR) so it can be fed
// to the AI flashcard generator.
export const extractTextFromFile = async (file) => {
  if (file.type === "application/pdf") return extractTextFromPdf(file);
  if (file.type.startsWith("image/")) return extractTextFromImage(file);
  throw new Error("Unsupported file type. Upload a PDF or an image.");
};
