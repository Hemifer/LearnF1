import { useEffect, useState } from "react";
import { getCategories } from "../utils/categories";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function Categories() {
    const { t } = useTranslation()
    const [categories, setCategories] = useState([]);
    const { user, userData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const list = await getCategories();
            setCategories(list);
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900 p-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-red-600">
                    {t("categories")}
                </h1>

                {userData?.role === "admin" && (
                    <button
                        onClick={() => navigate("/create-category")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-2xl font-semibold"
                    >
                        {t("addCategory")}
                    </button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => navigate(`/category/${cat.id}`)}
                            className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <h2 className="text-2xl font-bold text-red-800">{cat.title}</h2>
                            <h4 className="text-1s font-medium text-black">{cat.description}</h4>

                            <p className="text-sm text-gray-600 mt-2">
                                {t("topicsCount", { count: cat.topics?.length || 0 })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="font-medium text-left mx-12">
                        {t("noCategories")}
                    </p>
                )}
            </div>
        </div>
    );

}
