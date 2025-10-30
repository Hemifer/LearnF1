import { useState } from "react";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-gray-900 border-t border-gray-300 py-6 mt-10 text-center">
      <div className="flex justify-center gap-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
        >
          Help & Contact
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
              Help & Contact
            </h2>

            <div className="text-gray-700 text-left space-y-4">
              <p>
                Need help using <strong>LearnF1</strong>? Here are a few tips:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Browse categories from the navigation bar to start learning.</li>
                <li>Sign up or log in to save your progress.</li>
                <li>Admins can add or edit F1 topics directly.</li>
              </ul>

              <p className="pt-3">
                Still have questions?  
                <br />
                📧 Email us at:  
                <a
                  href="mailto:support@learnf1.com"
                  className="text-red-600 hover:underline ml-1"
                >
                  support@learnf1.com
                </a>
                <br />
                📧 SMS me at:  
                <a
                  href="sms:+4389358532"
                  className="text-red-600 hover:underline ml-1"
                >
                  +1 (438) 935-8532
                </a>
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

