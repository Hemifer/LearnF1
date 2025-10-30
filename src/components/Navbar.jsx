import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllTopics } from "../utils/topics";

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const [showAccount, setShowAccount] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getAllTopics().then(setTopics).catch(console.error);
  }, []);

  return (
    <nav className="bg-red-700 text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="flex justify-between items-center px-20 py-3 relative">
        <Link to="/" className="text-3xl font-bold tracking-wide">LearnF1</Link>

        <div className="flex gap-6 text-lg items-center">
           {/* Topics Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTopics(!showTopics)}
              className="hover:text-gray-300 font-medium"
            >
              Topics
            </button>

            {showTopics && (
              <div className="absolute top-10 left-0 bg-white text-gray-900 shadow-lg rounded-md w-64 p-3 z-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Topics</h3>
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
                    <li className="text-gray-500 text-sm">No topics yet</li>
                  )}
                </ul>
                <button
                  onClick={() => {
                    navigate(`/topics`);
                    setShowTopics(false);
                  }}
                  className="font-light w-full text-right hover:text-red-600"
                >
                  More...
                </button>
              </div>
            )}
          </div>

          <Link to="/categories" className="hover:text-gray-300">Categories</Link>
          <Link to="/donate" className="hover:text-green-300 font-semibold">Donate!</Link>

          {/* Account Section */}
          {user ? (
            <button
              onClick={() => setShowAccount(!showAccount)}
              className="hover:text-gray-300 font-medium"
            >
              Account
            </button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="hover:text-gray-300 font-medium">
                Log In
              </Link>
              <span className="text-gray-400">|</span>
              <Link to="/signup" className="hover:text-gray-300 font-medium">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Account Popup */}
        {showAccount && user && userData && (
          <div className="absolute right-20 top-16 bg-white text-gray-900 p-5 rounded-lg shadow-lg w-72 border border-gray-200 z-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-bold text-lg">{userData.name}</p>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full border border-gray-300 rounded-md py-2 hover:bg-gray-100 transition"
                onClick={() => alert("Edit profile coming soon!")}
              >
                Edit
              </button>
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
                onClick={() => {
                  logout();
                  setShowAccount(false);
                  navigate("/"); // optional redirect on logout
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}





