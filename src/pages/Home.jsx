import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-red-700">
        {t("welcome")}
      </h1>
      <h2 className="mt-4 text-[1.5rem] text-gray-700">
        {t("learnToday")}
        <br />
      </h2>
      <p className="text-gray-500">
        {t("searchByTopicOrCategory")}
      </p>
      <div className="mt-12">
        <Timeline />
      </div>
    </div>
  );

}

