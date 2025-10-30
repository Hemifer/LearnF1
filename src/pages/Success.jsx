// src/pages/Success.jsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Success() {
  const location = useLocation();
  const { userData } = useAuth();
  const [receipt, setReceipt] = useState({});


  // Extract session_id from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");

    if (sessionId) {
      fetch(`http://localhost:4000/session-status?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => setReceipt(data))
        .catch(console.error);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-full max-w-md border-t-4 border-green-600">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Thank you{userData?.name ? `, ${userData.name}` : ""}, for supporting{" "}
          <strong>LearnF1</strong> 🏎️
        </p>

        {!receipt ? (
          <p className="text-gray-500">Fetching your receipt...</p>
        ) : (
          <div className="bg-white rounded-lg shadow p-4 text-left mb-6 border">
            <h3 className="font-semibold text-gray-700 mb-2">Donation Receipt</h3>
            <p><strong>Name:</strong> {userData?.name || "Anonymous"}</p>
            <p><strong>Email:</strong> {receipt.customer_email}</p>
            <p>
              <strong>Amount:</strong> {receipt.amount_total}{" "}
              {receipt.currency}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{receipt.payment_status}</span>
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Date: {new Date().toLocaleString()}
            </p>
          </div>
        )}

        {receipt && receipt.receipt_url && (
          <a
            href={receipt.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline text-sm"
          >
            View official Stripe receipt
          </a>
        )}


        <div className="text-gray-600 mb-6 text-sm">
          A copy has also been sent to your email address.
        </div>

        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}


