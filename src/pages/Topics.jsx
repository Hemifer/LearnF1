import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Topics() {
  const { t } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTag = queryParams.get("tag");

  useEffect(() => {
    const fetchTopics = async () => {
      const querySnapshot = await getDocs(collection(db, "topics"));
      let topicsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (activeTag) {
        topicsList = topicsList.filter(topic =>
          topic.tags?.includes(activeTag)
        );
      }

      setTopics(topicsList);
      setLoading(false);
    };
    fetchTopics();
  }, [activeTag]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        {t("loadingTopics")}
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white text-gray-900 p-10">

      <h1 className="text-4xl font-bold text-red-600 mb-8">
        {t("allTopics")}
      </h1>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="p-5 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/topic/${topic.id}`)}
            >
              <h2 className="text-2xl font-semibold mb-2 text-red-700">
                {topic.title}
              </h2>

              <p className="text-gray-700 line-clamp-3 mb-3">
                {topic.description}
              </p>

              {topic.createdAt && (
                <p className="text-gray-500 text-sm mb-2">
                  {t("addedOn")}{" "}
                  {new Date(
                    topic.createdAt.seconds
                      ? topic.createdAt.seconds * 1000
                      : topic.createdAt
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}

              {/* Tags */}
              {topic.tags && topic.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topic.tags.map((tag, index) => (
                    <span
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/topics?tag=${tag}`);
                      }}
                      className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="font-bold">
            {t("noTopicsYet")}
          </p>
        )}
      </div>
    </div>
  );

}
