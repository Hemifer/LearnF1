import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";  // ✅ add deleteDoc
import { db } from "../firebase";
import { getTopicById } from "../utils/topics";
import { useTranslation } from "react-i18next";

export default function EditTopic() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [tagsInput, setTagsInput] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const normalizedUrl = imageUrl.trim().startsWith("http") ? imageUrl.trim() : "https://" + imageUrl.trim();
  const [audioBase64, setAudioBase64] = useState("");



  useEffect(() => {
    getTopicById(id).then(topic => {
      setTitle(topic.title);
      setDescription(topic.description);
      setTagsInput(topic.tags ? topic.tags.join(", ") : "");
      if (topic.createdAt) {
        const d = topic.createdAt.seconds
          ? new Date(topic.createdAt.seconds * 1000)
          : new Date(topic.createdAt);
        setDate(d.toISOString().split("T")[0]);
      }
      setImageUrl(topic.imageUrl || "");
      setAudioBase64(topic.audioBase64 || "");
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);
    try {
      const docRef = doc(db, "topics", id);
      await updateDoc(docRef, { title, description, tags, createdAt: new Date(date), imageUrl: normalizedUrl, audioBase64 });
      alert(t("topicUpdated"));
      navigate(`/topic/${id}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t("topicUpdateFailed"));
    }
  };

  //Audio file handler
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500000) {
      alert("Audio too large. Must be under 5 seconds.");
      return;
    }

    const encoded = await toBase64(file);
    setAudioBase64(encoded);
  };


  // ✅ Delete topic logic
  const handleDelete = async () => {
    const confirmDelete = window.confirm(t("confirmDeleteTopic"));
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "topics", id);
      await deleteDoc(docRef);
      alert(t("topicDeleted"));
      navigate("/topics");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t("topicDeleteFailed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">

        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          {t("editTopic")}
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>

          <input
            type="text"
            placeholder={t("tagsPlaceholder")}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

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

          {/* Audio Player */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("audClip")}</label>
            <input className="w-full border-black border-1 rounded-[0.5rem] hover:border-gray-500 hover:bg-gray-200"
              type="file" accept="audio/*" onChange={handleAudioUpload}
            />

            {audioBase64 && (
              <button
                type="button"
                className="mt-2 text-red-600 underline"
                onClick={() => setAudioBase64("")}
              >
                Remove Audio
              </button>
            )}
          </div>


          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
            >
              {t("saveChanges")}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition"
            >
              {t("deleteTopic")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

}

