import { useEffect, useState } from "react";
import { getAllTopics } from "../utils/topics";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Timeline() {
    const { t } = useTranslation();
    const [topics, setTopics] = useState([]);
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);


    useEffect(() => {
        const fetchTopics = async () => {
            const data = await getAllTopics();
            if (!data.length) return;

            const years = data.map((t) => {
                const d = t.createdAt?.seconds
                    ? new Date(t.createdAt.seconds * 1000)
                    : new Date(t.createdAt);
                return d.getFullYear();
            });

            const earliest = Math.min(...years);
            setStartYear(earliest);
            setTopics(
                data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            );
        };

        fetchTopics();
    }, []);

    if (!startYear) return null; // wait until topics load

    const totalYears = endYear - startYear;

    return (
        <div className="relative mt-50 px-10">
            <h3 className="text-md text-gray-500 my-10">{t("timelineForTopics")}</h3>

            <div className="relative h-[0.125rem] bg-red-900 w-full">
                <AnimatePresence>
                    {topics.map((topic, index) => {
                        const topicDate = topic.createdAt?.seconds
                            ? new Date(topic.createdAt.seconds * 1000)
                            : new Date(topic.createdAt);

                        const year = topicDate.getFullYear();
                        const progress = ((year - startYear) / totalYears) * 100;

                        return (
                            <motion.div
                                key={topic.id}
                                className="absolute flex flex-col items-center -ml-1"
                                style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
                                initial={{ opacity: 0, scale: 0, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 80,
                                }}
                                onMouseEnter={() => setHovered(topic.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <motion.div
                                    className="w-[0.050rem] bg-black"
                                    initial={{ height: 5 }}
                                    animate={{ height: 25 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                />

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={
                                        hovered === topic.id
                                            ? { opacity: 1, y: -10 }
                                            : { opacity: 0, y: 10 }
                                    }
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
                                >
                                    {topic.title}
                                </motion.div>

                                <motion.div
                                    className="w-2 h-2 bg-red-500 rounded-full shadow-md cursor-pointer"
                                    whileHover={{ scale: 1.75 }}
                                    whileTap={{ scale: 1.2 }}
                                    onClick={() => navigate(`/topic/${topic.id}`)}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
