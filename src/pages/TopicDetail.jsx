import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopicById } from "../utils/topics";
import { useAuth } from "../contexts/AuthContext";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getTopicById(id).then(setTopic).catch(console.error);
  }, [id]);

  if (!topic) return <p className="text-center mt-20 text-gray-600">Loading topic...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white text-gray-900 pt-24">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-3xl border-t-4 border-red-600 relative">
        {/* Admin-only edit button */}
        {userData?.role === "admin" && (
          <button
            onClick={() => navigate(`/edit-topic/${id}`)}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
        )}

        <h1 className="text-3xl font-bold text-red-600 mb-4">{topic.title}</h1>
        <p className="text-gray-700">{topic.description}</p>
      </div>

      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topic.tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering topic click
                    navigate(`/topics?tag=${tag}`);
                  }}
                  className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
