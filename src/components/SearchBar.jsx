import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTopics } from "../utils/topics";
import { getAllTags } from "../utils/tags"; // you'll create this soon
import { getCategories } from "../utils/categories"; // same here
import { useTranslation } from "react-i18next";

export default function SearchBar() {
  const { t } = useTranslation();
  const [searchType, setSearchType] = useState("topics");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllTopics(), getAllTags(), getCategories()])
      .then(([topicsData, tagsData, categoriesData]) => {
        setTopics(topicsData);
        setTags(tagsData);
        setCategories(categoriesData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    switch (searchType) {
      case "topics":
        setResults(topics.filter((t) => t.title.toLowerCase().includes(q)));
        break;
      case "tags":
        setResults(tags.filter((tag) => tag.toLowerCase().includes(q)));
        break;
      case "categories":
        setResults(categories.filter((c) => c.title.toLowerCase().includes(q)));
        break;
      default:
        setResults([]);
    }
  }, [query, searchType, topics, tags, categories]);

  const handleResultClick = (item) => {
    if (searchType === "topics") navigate(`/topic/${item.id}`);
    else if (searchType === "tags") navigate(`/topics?tag=${item}`);
    else if (searchType === "categories") navigate(`/category/${item.id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative flex items-center">
      <div className="relative">
        <input
          type="text"
          placeholder={
            searchType === "topics"
              ? t("searchTopics")
              : searchType === "tags"
                ? t("searchTags")
                : t("searchCategories")
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white px-4 py-2 pr-24 rounded-full border border-white focus:outline-none focus:ring-2 focus:ring-red-500 w-80 text-gray-900 text-sm placeholder-gray-500"
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-700 text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <option value="topics">{t("topics")}</option>
          <option value="tags">{t("tags")}</option>
          <option value="categories">{t("categories")}</option>
        </select>
      </div>

      {results.length > 0 && (
        <div className="absolute top-12 left-0 bg-white text-gray-900 w-80 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.id || item}
              onClick={() => handleResultClick(item)}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {searchType === "tags" ? item : item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );


}
