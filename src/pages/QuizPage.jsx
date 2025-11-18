// src/pages/QuizPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTopicById } from "../utils/topics";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [topic, setTopic] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 1. Load topic info
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const data = await getTopicById(id);
        setTopic(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load topic.");
      }
    };
    fetchTopic();
  }, [id]);

  // 2. When topic is loaded, call your /generate-quiz endpoint
  useEffect(() => {
    const generateQuiz = async () => {
      if (!topic) return;
      setGenerating(true);
      setError("");

      try {
        const languageLabel =
          i18n.language === "fr" ? "French" : "English";

        const response = await fetch("http://localhost:4000/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicTitle: topic.title,
            topicDescription: topic.description,
            language: languageLabel,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate quiz.");
        }

        const data = await response.json();

        if (!data.quiz || !Array.isArray(data.quiz.questions)) {
          throw new Error("Quiz format invalid.");
        }

        setQuiz(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(null));
      } catch (err) {
        console.error(err);
        setError("Failed to generate quiz.");
      } finally {
        setGenerating(false);
        setLoading(false);
      }
    };

    if (topic) {
      generateQuiz();
    }
  }, [topic, i18n.language]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    if (submitted) return;
    setAnswers(prev => {
      const copy = [...prev];
      copy[questionIndex] = answerIndex;
      return copy;
    });
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let newScore = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctIndex) {
        newScore++;
      }
    });

    setScore(newScore);
    setSubmitted(true);
  };

  const allAnswered = quiz
    ? answers.every(a => a !== null)
    : false;

  if (loading || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <p className="text-gray-600 text-lg">
          {t("loadingQuiz") || "Loading quiz..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow-md">
          <p className="font-semibold mb-2">
            {t("quizErrorTitle") || "Quiz Error"}
          </p>
          <p>{t("quizErrorMessage") || "Unable to load quiz. Please try again later."}</p>
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={() => navigate(-1)}
          >
            {t("goBack") || "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-gray-100 border-t-4 border-red-600 rounded-lg shadow-lg p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-red-600 hover:text-red-800 mb-4"
        >
          ← {t("backToTopic") || "Back to topic"}
        </button>

        <h1 className="text-3xl font-bold text-red-600 mb-2">
          {t("quizFor") || "Quiz for"} {topic.title}
        </h1>

        {generating && (
          <p className="text-gray-600 mb-4">
            {t("generatingQuiz") || "Generating quiz..."}
          </p>
        )}

        {quiz && (
          <>
            <p className="text-gray-700 mb-6">
              {t("quizInstructions") ||
                "Answer all questions below, then submit to see your score."}
            </p>

            <div className="space-y-6">
              {quiz.questions.map((q, qIndex) => {
                const selected = answers[qIndex];
                const isCorrect =
                  submitted && selected === q.correctIndex;
                const isIncorrect =
                  submitted &&
                  selected !== null &&
                  selected !== q.correctIndex;

                return (
                  <div
                    key={qIndex}
                    className={`p-4 rounded-lg border shadow-sm bg-white ${
                      isCorrect
                        ? "border-green-400"
                        : isIncorrect
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-semibold mb-3">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.answers.map((answerText, aIndex) => {
                        const isSelected = selected === aIndex;
                        const isAnswerCorrect =
                          submitted && aIndex === q.correctIndex;
                        const isAnswerWrongSelected =
                          submitted &&
                          isSelected &&
                          aIndex !== q.correctIndex;

                        return (
                          <button
                            key={aIndex}
                            type="button"
                            onClick={() =>
                              handleAnswerChange(qIndex, aIndex)
                            }
                            className={`w-full text-left px-3 py-2 rounded-md border transition
                              ${
                                isSelected
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300 bg-white hover:bg-gray-100"
                              }
                              ${
                                isAnswerCorrect
                                  ? "border-green-500 bg-green-50"
                                  : ""
                              }
                              ${
                                isAnswerWrongSelected
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              }
                            `}
                            disabled={submitted}
                          >
                            {answerText}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && q.explanation && (
                      <p className="mt-3 text-sm text-gray-700">
                        <span className="font-semibold">
                          {t("explanation") || "Explanation"}:
                        </span>{" "}
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit + Score */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`px-6 py-2 rounded-md text-white font-semibold transition
                    ${
                      allAnswered
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {t("submitQuiz") || "Submit Quiz"}
                </button>
              )}

              {submitted && (
                <div className="text-lg font-semibold text-gray-800">
                  {t("yourScore") || "Your score"}: {score} /{" "}
                  {quiz.questions.length}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
