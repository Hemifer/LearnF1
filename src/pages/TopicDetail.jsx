import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopicById } from "../utils/topics";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import Linkify from 'react-linkify';

export default function TopicDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const { userData, toggleFavorite, isFavorite } = useAuth();
  const navigate = useNavigate();

  const linkifyOptions = {
    defaultProtocol: "https",
    target: "_blank",
    rel: "noopener noreferrer",
  };


  useEffect(() => {
    getTopicById(id).then(setTopic).catch(console.error);
  }, [id]);

  if (!topic)
    return (
      <p className="text-center mt-20 text-gray-600">
        {t("loadingTopic")}
      </p>
    );

  const validImage = Boolean(
    topic?.imageUrl &&
    typeof topic.imageUrl === "string" &&
    topic.imageUrl.trim().length > 5 &&
    topic.imageUrl.trim().startsWith("http")
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white text-gray-900 pt-24">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-3xl border-t-4 border-red-600 relative">

        {/* Admin-only edit button */}
        {userData?.role === "admin" && (
          <button
            onClick={() => navigate(`/edit-topic/${id}`)}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            {t("edit")}
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-red-600 mb-4">{topic.title}</h1>

          {/* Favorite Icon */}
          {userData && (
            <button
              onClick={() => toggleFavorite(topic.id)}
              className="text-yellow-400 text-5xl mx-20 -mt-6 hover:scale-110 transition"
              title={isFavorite(topic.id) ? t("removeFavorite") : t("addFavorite")}
            >
              {isFavorite(topic.id) ? "★" : "☆"}
            </button>
          )}
        </div>

        {validImage ? (
          <img
            src={topic.imageUrl.trim()}
            alt={topic.title}
            className="max-w-[400px] max-h-[400px] rounded-lg shadow-md object-contain"
          />
        ) : null}

        {topic.createdAt && (
          <p className="text-gray-500 text-sm mb-4">
            {t("appeared")}{" "}
            {(() => {
              const rawDate = topic.createdAt.seconds
                ? new Date(topic.createdAt.seconds * 1000)
                : new Date(topic.createdAt);

              const localDate = new Date(
                rawDate.getTime() + rawDate.getTimezoneOffset() * 60000
              );

              return localDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            })()}
          </p>
        )}

        <Linkify options={linkifyOptions}>
          <p className="whitespace-pre-line">{topic.description}</p>
        </Linkify>

        {topic.audioBase64 && (
          <div className="mt-4">
            <audio controls>
              <source src={topic.audioBase64} type="audio/mpeg" />
              {t("audioNotSupported")}
            </audio>
          </div>
        )}

      </div>

      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex flex-wrap gap-2 mt-2">
            {topic.tags.map((tag, index) => (
              <span
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/topics?tag=${tag}`);
                  window.location.reload();
                }}
                className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => navigate(`/quiz/${id}`)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          {t("takeQuiz") || "Take Quiz"}
        </button>
      </div>

    </div>
  );
}
