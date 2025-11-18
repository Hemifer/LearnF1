import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllTopics } from "../utils/topics";
import SearchBar from "./SearchBar";
import Logo from "../assets/Learnf1logo.png";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";


export default function Navbar() {
  const { t } = useTranslation()
  const { user, userData, logout } = useAuth();
  const [showAccount, setShowAccount] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");//Search bar implementation

  useEffect(() => {
    getAllTopics().then(setTopics).catch(console.error);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to a dedicated Search page with the query
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

    // Clear input
    setSearchQuery("");
  };

  return (
    <nav className="bg-red-700 text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="flex justify-between items-center px-14 py-3 relative">
        <button
          onClick={() => navigate("/")}
          className="flex items-center hover:opacity-80 transition cursor-pointer"
        >
          <img
            src={Logo}
            alt="LearnF1 Logo"
            className="h-50  w-50 -mt-20 -mb-20"
          />
        </button>

        <div className="flex gap-4 text-lg items-center">
          <SearchBar />

          {/* Topics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTopics(!showTopics)}
              className="text-white hover:text-gray-300 font-medium"
            >
              {t("topics")}
            </button>

            {showTopics && (
              <div className="absolute top-10 left-0 bg-white text-gray-900 shadow-lg rounded-md w-64 p-3 z-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{t("topics")}</h3>

                  {userData?.role === "admin" && (
                    <button
                      onClick={() => navigate("/create-topic")}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      +
                    </button>
                  )}
                </div>

                <ul className="space-y-1">
                  {topics.length > 0 ? (
                    topics.map(topic => (
                      <li key={topic.id}>
                        <button
                          onClick={() => {
                            navigate(`/topic/${topic.id}`);
                            setShowTopics(false);
                          }}
                          className="text-xs font-bold bg-gray-200 hover:bg-gray-300 px-1 py-1 mx-0.5 text-left rounded-md transition"
                        >
                          {topic.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">
                      {t("noTopics")}
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => {
                    navigate(`/topics`);
                    setShowTopics(false);
                  }}
                  className="font-light w-full text-right hover:text-red-600"
                >
                  {t("more")}
                </button>
              </div>
            )}
          </div>

          <Link to="/categories" className="hover:text-gray-300 font-medium">
            {t("categories")}
          </Link>

          <Link to="/donate" className="hover:text-green-300 font-semibold">
            {t("donate")}
          </Link>

          {/* Account Section */}
          {user ? (
            <button
              onClick={() => setShowAccount(!showAccount)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img
                src={
                  userData?.photoBase64 ||
                  user.photoURL ||
                  "https://i.imgur.com/6VBx3io.png"
                }
                className="w-8 h-8 rounded-full object-cover border"
                alt="avatar"
              />
              <span className="font-medium">{t("account")}</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="hover:text-gray-300 font-medium">
                {t("login")}
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/signup" className="hover:text-gray-300 font-medium">
                {t("signup")}
              </Link>
            </div>
          )}

          <button
            onClick={toggleLanguage}
            className="px-3 py-1 border border-white rounded-full text-sm hover:bg-white hover:text-red-700 transition"
          >
            {i18n.language === "en" ? "Fr" : "En"}
          </button>
        </div>

        {/* Account Popup */}
        {showAccount && user && userData && (
          <div className="absolute right-20 top-16 bg-white text-gray-900 p-5 rounded-lg shadow-lg w-72 border border-gray-200 z-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>

              <img
                src={
                  userData?.photoBase64 ||
                  user.photoURL ||
                  "https://i.imgur.com/6VBx3io.png"
                }
                className="w-10 h-10 rounded-full object-cover border"
                alt="avatar"
              />

              <div>
                <p className="font-bold text-lg">{userData.name}</p>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
                onClick={() => navigate("/account")}
              >
                {t("viewAccount")}
              </button>

              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
                onClick={() => {
                  logout();
                  setShowAccount(false);
                  navigate("/");
                }}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

}