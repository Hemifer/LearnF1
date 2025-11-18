import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  updateEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AccountEdit() {
  const { t } = useTranslation();
  const { user, userData } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || user.email || "");
    }
  }, [userData, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return alert(t("mustBeLoggedIn"));

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);

      // Update Firestore name
      if (name && name !== userData.name) {
        await updateDoc(userRef, { name });
        await updateProfile(user, { displayName: name });
      }

      // Update email
      if (email && email !== user.email) {
        await updateEmail(user, email);
        await updateDoc(userRef, { email });
      }

      // Update password (if provided)
      if (password) {
        await updatePassword(user, password);
      }

      alert(t("accountUpdated"));
      navigate("/account");
      window.location.reload(); // refresh to show latest info
    } catch (err) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        alert(t("reloginRequired"));
      } else {
        alert(t("accountUpdateFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userData)
  return (
    <div className="flex justify-center items-center min-h-screen text-gray-600">
      {t("loadingAccount")}
    </div>
  );

  return (
  <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        {t("editAccount")}
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* Name */}
        <input
          type="text"
          placeholder={t("fullName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* Email */}
        <input
          type="email"
          placeholder={t("emailAddress")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* Password */}
        <input
          type="password"
          placeholder={t("newPasswordNote")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-35 py-2 -center rounded-lg text-white transition ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? t("updating") : t("saveChanges")}
        </button>

        <button
          type="button"
          onClick={() => navigate("/account")}
          className="w-full mt-2 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
        >
          {t("cancel")}
        </button>

      </form>
    </div>
  </div>
);

}
