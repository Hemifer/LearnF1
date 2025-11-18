// src/pages/Cancel.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Cancel() {
  const { t } = useTranslation() 
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-full max-w-md border-t-4 border-red-600">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        {t("paymentCanceled")}
      </h1>

      <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">
        {t("paymentCanceledMsg")}
      </p>

      <Link
        to="/donate"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
      >
        {t("tryAgain")}
      </Link>
    </div>
  </div>
);

}
