import { useState } from "react";
import { createTopic } from "../utils/topics";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreateTopic() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const normalizedUrl =
    imageUrl && imageUrl.trim() !== ""
      ? (imageUrl.trim().startsWith("http")
        ? imageUrl.trim()
        : "https://" + imageUrl.trim())
      : "";


  // Default to today's date (ISO format)
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  //Audio Addition.
  const [audioBase64, setAudioBase64] = useState("");

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Restrict file size (~5 secs < 500 KB)
    if (file.size > 500000) {
      alert("Audio too large. Must be under 5 seconds or < 500KB.");
      return;
    }

    const encoded = await toBase64(file);
    setAudioBase64(encoded);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert(t("mustBeLoggedInCreateTopic"));

    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      // Note: createTopic now includes imageUrl and date
      await createTopic(
        title.trim(),
        description.trim(),
        user.uid,
        tags,
        date,
        imageUrl.trim() || "",
        audioBase64 || ""
      );

      alert(t("topicCreated"));
      navigate("/topics");
      window.location.reload();

    } catch (err) {
      if (err.message.includes("already exists")) {
        alert(t("topicExists"));
      } else {
        console.error(err);
        alert(t("topicCreateFailed"));
      }
    }
  };

  return (
    <div className="min-h-screen -mt-20 -mb-20 flex items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">

        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("createNewTopic")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder={t("topicTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <textarea
            placeholder={t("topicDescription")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>

          {/* Tags Input */}
          <input
            type="text"
            placeholder={t("tagsPlaceholder")}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Date Input */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Image URL Input (optional) */}
          <input
            type="text"
            placeholder={t("imageUrlOptional")}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("audClip")}</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="w-full border-black border-1 rounded-[0.5rem] hover:border-gray-500 hover:bg-gray-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            {t("createTopic")}
          </button>
        </form>
      </div>
    </div>
  );
}

