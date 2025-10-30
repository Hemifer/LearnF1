import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { createCategory } from "../utils/categories";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            const snapshot = await getDocs(collection(db, "topics"));
            setTopics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchTopics();
    }, []);

    const toggleTopic = (id) => {
        setSelectedTopics((prev) =>
            prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
        );
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createCategory(title, description, selectedTopics);
            alert("Category created successfully!");
            navigate("/categories");
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Failed to create category.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">
                <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
                    Create New Category
                </h1>
                <form onSubmit={handleCreate} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Category Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                    <textarea
                        type="text"
                        placeholder="Category Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                    {/* ✅ Dropdown for topics */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Topics
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-white border rounded p-3 space-y-2">
                        {topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <div key={topic.id}>
                                    <label
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTopics.includes(topic.id)}
                                            onChange={() => toggleTopic(topic.id)}
                                            className="text-red-600 focus:ring-red-600"
                                        />
                                        <span className="text-gray-800">{topic.title}</span>
                                    </label>

                                    {/* ✅ Divider line, except after the last item */}
                                    {index !== topics.length - 1 && (
                                        <hr className="border-t border-gray-200 my-1" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No topics found.</p>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
                    >
                        Create Category
                    </button>
                </form>
            </div>
        </div>
    );
}
