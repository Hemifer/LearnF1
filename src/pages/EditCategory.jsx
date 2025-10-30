import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, getDocs, deleteDoc, collection, updateDoc } from "firebase/firestore";

export default function EditCategory() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ Fetch all topics for dropdown
                const topicsSnapshot = await getDocs(collection(db, "topics"));
                const topicsList = topicsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTopics(topicsList);

                // ✅ Fetch category details
                const catRef = doc(db, "categories", id);
                const catSnap = await getDoc(catRef);

                if (catSnap.exists()) {
                    const data = catSnap.data();
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setSelectedTopics(data.topics || []);
                } else {
                    alert("Category not found.");
                    navigate("/categories");
                }
            } catch (error) {
                console.error("Error loading category:", error);
                alert("Failed to load category data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const toggleTopic = (id) => {
        setSelectedTopics((prev) =>
            prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
        );
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const catRef = doc(db, "categories", id);
            await updateDoc(catRef, {
                title,
                description,
                topics: selectedTopics,
                updatedAt: new Date(),
            });
            alert("Category updated successfully!");
            navigate(`/category/${id}`);
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Failed to update category.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this topic? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const docRef = doc(db, "categories", id);
            await deleteDoc(docRef);
            alert("Category deleted successfully.");
            navigate("/categories");
        } catch (error) {
            console.error(error);
            alert("Failed to delete Category.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-600">
                Loading category data...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-red-600">
                <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
                    Edit Category
                </h1>
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Category Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Category Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    ></textarea>

                    {/* Topics dropdown */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Topics
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
                                        <hr className="border-t border-gray-300 my-1" />
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
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded transition"
                    >
                        Delete Category
                    </button>

                </form>
            </div>
        </div>
    );
}
