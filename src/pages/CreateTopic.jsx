import { useState } from "react";
import { createTopic } from "../utils/topics";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateTopic() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // ✅ new state
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to create a topic.");

    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      await createTopic(title.trim(), description.trim(), user.uid, tags);
      alert("Topic created successfully!");
      navigate("/");
    } catch (err) {
      if (err.message.includes("already exists")) {
        alert("A topic with this title already exists. Please choose a different name.");
      } else {
        console.error(err);
        alert("Failed to create topic.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Create New Topic</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Topic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <textarea
            placeholder="Topic Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>

          {/* ✅ Tags input */}
          <input
            type="text"
            placeholder="Tags (comma separated, e.g. Teams, Drivers, History)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            Create Topic
          </button>
        </form>
      </div>
    </div>
  );
}
