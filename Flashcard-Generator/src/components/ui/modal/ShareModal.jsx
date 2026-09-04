import React, { useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";

import { VscCopy, VscClose } from "react-icons/vsc";
import { BiShareAlt } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../button/Button";
import ShareOnSocial from "react-share-on-social";
import { useSetFlashcardGroupVisibility } from "../../../hooks/useFlashcards";

const ShareModal = ({ show, hide, flashcard }) => {
  const [copied, setCopied] = useState(false);
  const { mutate: setVisibility, isPending: isUpdatingVisibility } =
    useSetFlashcardGroupVisibility(flashcard?.id);

  if (!flashcard) return null;

  const shareUrl = `${window.location.origin}/share/${flashcard.id}`;

  const socialShare = [
    {
      id: 1,
      btn: (
        <FacebookShareButton url={shareUrl} title="share on facebook">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      ),
    },
    {
      id: 2,
      btn: (
        <LinkedinShareButton url={shareUrl} title="share on linkedin">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      ),
    },
    {
      id: 3,
      btn: (
        <WhatsappShareButton url={shareUrl} title="share on whatsapp">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      ),
    },
    {
      id: 4,
      btn: (
        <TwitterShareButton url={shareUrl} title="share on twitter">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      ),
    },
    {
      id: 5,
      btn: (
        <EmailShareButton url={shareUrl} title="share on email">
          <EmailIcon size={32} round />
        </EmailShareButton>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {show === "grid" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => hide("hidden")}
          className="fixed inset-0 w-full h-screen grid place-items-center bg-black/70 backdrop-blur-sm z-50"
        >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="bg-brandSurface border border-brandBorder text-white p-10 w-96 rounded-2xl shadow-xl relative"
      >
        <div className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-brandCyan transition-colors">
          <Button
            type={"button"}
            text={<VscClose />}
            fn={() => {
              hide("hidden");
            }}
          />
        </div>

        <h3 className="font-display font-semibold text-lg text-white">Share</h3>

        <label className="flex items-center gap-2 mt-4 text-gray-300 text-sm">
          <input
            type="checkbox"
            checked={flashcard.is_public}
            disabled={isUpdatingVisibility}
            onChange={(e) => setVisibility(e.target.checked)}
            className="accent-brandCyan"
          />
          Anyone with the link can view this set
        </label>

        {!flashcard.is_public && (
          <p className="text-sm text-gray-500 mt-1">
            Turn this on to generate a public, view-only link.
          </p>
        )}

        {flashcard.is_public && (
          <>
            <div className="flex items-center gap-3 justify-between mt-4 mb-8">
              <div>
                <input
                  type="url"
                  name="page_url"
                  id="page_url"
                  disabled
                  value={shareUrl}
                  className="border border-brandBorder border-dashed bg-brandBg text-gray-300 text-sm px-2 py-1.5 rounded-md w-60 truncate"
                />
              </div>

              <div>
                <ul className="flex items-center gap-3 text-xl text-gray-500 hover:text-brandCyan transition-colors">
                  <li>
                    <button
                      type="button"
                      title="copy page link"
                      disabled={copied}
                      onClick={() => {
                        setCopied((prev) => !prev);
                        navigator.clipboard.writeText(shareUrl);
                        setTimeout(() => {
                          setCopied((prev) => !prev);
                        }, 1000);
                      }}
                      className="active:bg-blue-200"
                    >
                      {copied ? <MdDone /> : <VscCopy />}
                    </button>
                  </li>
                  <li>
                    <ShareOnSocial
                      textToShare={flashcard.description}
                      link={shareUrl}
                      linkTitle={flashcard.name}
                      linkMetaDesc={flashcard.description}
                      linkFavicon={"dummy"}
                      noReferer
                    >
                      <button type="button" title="share page link">
                        <BiShareAlt />
                      </button>
                    </ShareOnSocial>
                  </li>
                </ul>
              </div>
            </div>

            <ul className="flex items-center gap-4 justify-between flex-wrap">
              {socialShare.map(({ id, btn }) => (
                <li key={id}>{btn}</li>
              ))}
            </ul>
          </>
        )}
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
