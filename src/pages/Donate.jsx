import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Donate() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || !email) {
      alert(t("enterAmountAndEmail"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert(t("failedCheckoutSession"));
      }
    } catch (err) {
      console.error(err);
      alert(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">

        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("supportLearnF1")}
        </h1>

        <input
          type="number"
          placeholder={t("enterAmount")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <input
          type="email"
          placeholder={t("yourEmail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <button
          onClick={handleDonate}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
        >
          {loading ? t("processing") : t("donateNow")}
        </button>

      </div>
    </div>
  );

}
