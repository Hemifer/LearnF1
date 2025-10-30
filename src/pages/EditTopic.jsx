import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";  // ✅ add deleteDoc
import { db } from "../firebase";
import { getTopicById } from "../utils/topics";

export default function EditTopic() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
  getTopicById(id).then(topic => {
    setTitle(topic.title);
    setDescription(topic.description);
    setTagsInput(topic.tags ? topic.tags.join(", ") : "");
  });
}, [id]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  const tags = tagsInput.split(",").map(t => t.trim()).filter(t => t);
  try {
    const docRef = doc(db, "topics", id);
    await updateDoc(docRef, { title, description, tags });
    alert("Topic updated successfully!");
    navigate(`/topic/${id}`);
  } catch (error) {
    console.error(error);
    alert("Failed to update topic.");
  }
};

  // ✅ Delete topic logic
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this topic? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "topics", id);
      await deleteDoc(docRef);
      alert("Topic deleted successfully.");
      navigate("/topics");
    } catch (error) {
      console.error(error);
      alert("Failed to delete topic.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          Edit Topic
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition"
            >
              Delete Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

