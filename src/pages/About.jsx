export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-900 pt-24 px-6 flex justify-center">
      <div className="max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-red-100 relative overflow-hidden">

        {/* Light F1-themed background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/src/assets/checkerpattern.png')] bg-repeat"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-red-700 mb-4">
            About LearnF1
          </h1>

          <p className="text-lg leading-relaxed mb-6">
            LearnF1 is an educational platform built to make understanding 
            <span className="text-red-600 font-semibold"> Formula 1</span> easy, intuitive, and enjoyable for fans of all experience levels.  
            Whether you're just discovering the sport or diving deeper into its technical and historical roots, 
            LearnF1 aims to guide you through every corner, straight, rule, team, and story that shapes this unique sport.
          </p>

          <p className="text-lg leading-relaxed mb-6">
            Every topic on the site is written to be clear, accessible, and beginner-friendly —
            while still offering depth for those who want to expand their knowledge.  
            With structured categories, searchable content, a historical timeline, and community-focused features,
            LearnF1 aims to become one of the most complete fan-driven learning resources available.
          </p>

          <p className="text-lg leading-relaxed mb-8">
            This project is built with passion, and updated continuously with new topics, improvements, and features.
            As we grow, our goal is to create a space where fans can learn together, explore the sport’s history,
            and connect over their love of racing.
          </p>

          {/* Donation Invite */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-semibold text-red-700 mb-2">
              Support the Project
            </h2>
            <p className="text-md leading-relaxed mb-4">
              LearnF1 is entirely independent and free to use.  
              If you enjoy the platform and want to help keep it growing — from server costs to new features —
              consider making a small donation.  
              Every contribution helps fuel future updates and improvements.
            </p>

            <button
              onClick={() => window.location.href = "/donate"}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Donate to LearnF1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}