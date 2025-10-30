import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // ✅ Fetch category info
        const categoryRef = doc(db, "categories", id);
        const categorySnap = await getDoc(categoryRef);

        if (categorySnap.exists()) {
          const data = categorySnap.data();
          setCategory(data);

          // ✅ Fetch all topics belonging to this category
          if (data.topics && data.topics.length > 0) {
            const topicsSnapshot = await getDocs(collection(db, "topics"));
            const allTopics = topicsSnapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            const filteredTopics = allTopics.filter((t) =>
              data.topics.includes(t.id)
            );
            setTopics(filteredTopics);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Category not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-red-500">Category: {category.title}</h1>
          {category.description && (
            <p className="text-gray-700 text-lg mt-2 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>

        {/* ✅ Admin edit button */}
        {userData?.role === "admin" && (
          <button
            onClick={() => navigate(`/edit-category/${id}`)}
            className="bg-black text-white px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-gray-800 font-semibold"
          >
            Edit Category
          </button>
        )}
      </div>

      {/* Topics Section */}
      <h2 className="text-2xl font-bold text-black mb-4">
        Topics in this Category:
      </h2>

      {topics.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/topic/${topic.id}`)}
              className="p-5 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-bold text-red-700 mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-700 line-clamp-3">{topic.description}</p>

              {/* Optional: Show tags if any */}
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {topic.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 italic">
          No topics assigned to this category yet.
        </p>
      )}
    </div>
  );
}
