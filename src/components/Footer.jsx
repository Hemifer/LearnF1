import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  return (
  <footer className="bg-gray-900 border-t border-gray-300 py-4 mt-10 text-center">
    <div className="flex justify-center gap-200">
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
      >
        {t("helpContact")}
      </button>

      <button
        onClick={() => navigate("/about")}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
      >
        {t("aboutUs")}
      </button>
    </div>

    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
            {t("helpContact")}
          </h2>

          <div className="text-gray-700 text-left space-y-4">
            <p
              dangerouslySetInnerHTML={{
                __html: t("helpIntro")
              }}
            />

            <ul className="list-disc pl-6 space-y-1">
              <li>{t("helpTipBrowse")}</li>
              <li>{t("helpTipSignup")}</li>
              <li>{t("helpTipAdmin")}</li>
            </ul>

            <p className="pt-3">
              {t("helpQuestions")}
              <br />
              📧 {t("helpEmailLabel")}
              <a
                href="mailto:support@learnf1.com"
                className="text-red-600 hover:underline ml-1"
              >
                support@learnf1.com
              </a>
              <br />
              📧 {t("helpSMSLabel")}
              <a
                href="sms:+4389358532"
                className="text-red-600 hover:underline ml-1"
              >
                +1 (438) 935-8532
              </a>
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    )}
  </footer>
);

}

