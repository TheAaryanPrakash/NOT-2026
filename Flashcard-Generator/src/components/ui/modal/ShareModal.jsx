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
    <div
      className={`fixed inset-0 w-full h-screen place-items-center bg-gray-500 bg-opacity-60 backdrop-blur-[1px] ${show}`}
    >
      <div className="bg-brandSurface text-white p-10 w-96 rounded-md shadow-md relative">
        <div className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-brandAqua transition-all">
          <Button
            type={"button"}
            text={<VscClose />}
            fn={() => {
              hide("hidden");
            }}
          />
        </div>

        <h3 className="font-semibold text-brandAqua">Share</h3>

        <label className="flex items-center gap-2 mt-4 text-gray-300">
          <input
            type="checkbox"
            checked={flashcard.is_public}
            disabled={isUpdatingVisibility}
            onChange={(e) => setVisibility(e.target.checked)}
          />
          Anyone with the link can view this set
        </label>

        {!flashcard.is_public && (
          <p className="text-sm text-gray-400 mt-1">
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
                  className="border-2 border-gray-700 border-dashed bg-black text-white px-2 py-1 rounded-md w-60 truncate"
                />
              </div>

              <div>
                <ul className="flex items-center gap-3 text-xl text-gray-400 hover:text-brandAqua transition-all">
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
      </div>
    </div>
  );
};

export default ShareModal;
