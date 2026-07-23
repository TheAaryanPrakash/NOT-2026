import React, { useState } from "react";
import { AiFillFileImage } from "react-icons/ai";
import { supabase } from "../lib/supabaseClient";
import { extractTextFromFile } from "../lib/textExtraction";
import Button from "./ui/button/Button";

const AiGenerator = ({ setFieldValue }) => {
  const [notes, setNotes] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setIsExtracting(true);
    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted) {
        throw new Error("Couldn't find any text in that file.");
      }
      setNotes(extracted);
    } catch (err) {
      setError(err.message || "Couldn't read that file. Try another one.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-flashcards",
        { body: { text: notes } }
      );

      // supabase-js only rejects on network failure; app-level errors (4xx/5xx)
      // come back as a normal payload with an `error` field.
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setFieldValue("groups.group", data.group || "");
      setFieldValue(
        "terms",
        data.terms.map(({ term, definition }) => ({
          term,
          definition,
          image: null,
          imageFile: null,
        }))
      );
      setNotes("");
    } catch (err) {
      setError(err.message || "Couldn't generate flashcards. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const busy = isExtracting || isGenerating;

  return (
    <div className="bg-brandSurface shadow-md md:p-10 p-5 rounded-md sm:p-5">
      <h3 className="font-semibold text-lg mb-3 text-brandAqua">
        Generate with AI
      </h3>
      <p className="text-gray-400 mb-4">
        Paste notes below, or upload a PDF / image of your notes, and AI will
        turn them into a flashcard set you can review and edit before saving.
      </p>

      <div className="mb-4">
        <Button
          type="button"
          btnclass="border-2 border-brandBorder text-white rounded-md min-w-max font-semibold text-lg px-6 py-2 hover:border-brandAqua transition-all"
          text={
            <label className="flex items-center gap-1 cursor-pointer">
              <AiFillFileImage className="text-brandAqua" />
              {isExtracting ? "Reading file..." : "Upload PDF or Image"}
              <input
                type="file"
                hidden
                accept="application/pdf,image/*"
                disabled={busy}
                onChange={handleFileChange}
              />
            </label>
          }
        />
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your notes here (at least a few sentences)..."
        className="p-2 text-lg border-2 border-brandBorder bg-black text-white placeholder-gray-500 rounded-md h-40 w-full resize-none focus:outline-none focus:border-brandAqua"
      />
      {error && <p className="text-red-400 font-semibold mt-2">{error}</p>}
      <div className="mt-4">
        <Button
          type="button"
          disabled={notes.trim().length < 20 || busy}
          fn={handleGenerate}
          btnclass={`font-semibold rounded-md text-white px-6 py-2 transition-all ${
            notes.trim().length < 20 || busy
              ? "bg-gray-800 text-gray-500"
              : "bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
          }`}
          text={isGenerating ? "Generating..." : "Generate Flashcards"}
        />
      </div>
    </div>
  );
};

export default AiGenerator;
