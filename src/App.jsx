import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Donate from "./pages/Donate";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import TopicDetail from "./pages/TopicDetail";
import CreateTopic from "./pages/CreateTopic";
import EditTopic from "./pages/EditTopic";
import Topics from "./pages/Topics";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-black-900">
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/create-topic" element={<CreateTopic />} />
            <Route path="/topic/:id" element={<TopicDetail />} />
            <Route path="/edit-topic/:id" element={<EditTopic />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/create-category" element={<CreateCategory />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/edit-category/:id" element={<EditCategory />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

