import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const compressImage = (file, maxWidth = 256, maxHeight = 256, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        // Draw resized image on a canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG (~70% quality)
        let base64 = canvas.toDataURL("image/jpeg", quality);

        // If still too large (>80KB), lower quality further
        let currentQuality = quality;
        while (base64.length > 80 * 1024 && currentQuality > 0.3) {
          currentQuality -= 0.1;
          base64 = canvas.toDataURL("image/jpeg", currentQuality);
        }

        resolve(base64);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
};

export default function Account() {
  const { t } = useTranslation();
  const { user, userData } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  if (!userData)
  return (
    <p className="text-center mt-20 text-gray-600">
      {t("loadingAccount")}
    </p>
  );

  // Convert image -> Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // base64 encoding
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // live preview
    setPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const base64 = await compressImage(file);

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        photoBase64: base64,
      });

      alert(t("profileUpdated"));
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(t("profileUpdateFailed"));
    } finally {
      setUploading(false);
    }
  };

  const avatar =
    preview ||
    userData.photoBase64 ||
    "https://i.imgur.com/6VBx3io.png"; // default avatar

  return (
  <div className="min-h-screen flex flex-col items-center justify-start pt-28 bg-white text-gray-900">
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600 text-center">

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src={avatar}
          alt="Profile"
          className="w-38 h-38 rounded-full object-cover border-4 border-red-600 shadow-md"
        />
      </div>

      {/* Upload Button */}
      <label className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
        {uploading ? t("uploading") : t("changePicture")}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      <p className="text-[1rem] text-gray-400 mt-2">
        {t("pictureSizeNote")}
      </p>

      <h2 className="text-2xl font-bold mt-6 text-red-700">
        {userData.name}
      </h2>

      <p className="text-gray-600">{userData.email}</p>

      <p className="text-sm text-gray-500 mt-1">
        {t("roleLabel")} {userData.role}
      </p>

      <button
        onClick={() => navigate("/account-edit")}
        className="w-full mt-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition"
      >
        {t("editAccount")}
      </button>

    </div>
  </div>
);

}

