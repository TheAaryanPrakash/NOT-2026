import React, { useState } from "react";
import { AiFillFileImage } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
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

      // On a non-2xx response, supabase-js's error.message is just a generic
      // "non-2xx status code" wrapper — the real reason is in the response
      // body, reachable via error.context (the raw Response object).
      if (fnError) {
        let message = fnError.message;
        if (fnError.context?.json) {
          try {
            const body = await fnError.context.json();
            if (body?.error) message = body.error;
          } catch {
            // response body wasn't JSON; fall back to the generic message
          }
        }
        throw new Error(message);
      }
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-brandSurface border border-brandCyan/20 shadow-md md:p-10 p-5 rounded-xl sm:p-5 relative overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brandCyan/10 blur-3xl -z-10"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <h3 className="relative font-display font-semibold text-lg mb-3 text-brandCyan flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brandCyan animate-pulse" />
        Generate with AI
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        Paste notes below, or upload a PDF / image of your notes, and AI will
        turn them into a flashcard set you can review and edit before saving.
      </p>

      <div className="mb-4">
        <Button
          type="button"
          btnclass="border border-brandBorder text-white rounded-lg min-w-max font-semibold text-sm px-5 py-2.5 hover:border-brandCyan transition-colors"
          text={
            <label className="flex items-center gap-2 cursor-pointer">
              <AiFillFileImage className="text-brandCyan" />
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
        className="p-3 text-base border border-brandBorder bg-brandBg text-white placeholder-gray-600 rounded-lg h-40 w-full resize-none transition-colors focus:outline-none focus:border-brandCyan focus:ring-1 focus:ring-brandCyan/50"
      />
      <AnimatePresence>
        {error && (
          <motion.p
            key="ai-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-brandRed font-semibold mt-2 text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mt-4">
        <Button
          type="button"
          disabled={notes.trim().length < 20 || busy}
          fn={handleGenerate}
          btnclass={`font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors ${
            notes.trim().length < 20 || busy
              ? "bg-brandBorder text-gray-500"
              : "bg-brandCyan text-black hover:bg-white"
          }`}
          text={isGenerating ? "Generating..." : "Generate Flashcards"}
        />
      </div>
    </motion.div>
  );
};

export default AiGenerator;
