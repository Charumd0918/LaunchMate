import { useState } from "react";
import api from "./api";
import CinematicLoader from "./CinematicLoader";

function Input({ setPage }) {
  const [idea, setIdea] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!idea || !summary) {
      alert("Please fill all fields!");
      return;
    }

    setIsLoading(true);

    try {
      const fullIdea = idea + " " + summary;

      const response = await api.get(`/validate?idea=${encodeURIComponent(fullIdea)}`);

      if (response.data.error) {
         throw new Error(response.data.error);
      }

      console.log("Backend response:", response.data);

      localStorage.setItem("launchmate_active_idea", idea);
      localStorage.setItem("launchmate_analysis_data", summary);
      
      setPage("dashboard");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 401) {
          alert("Authentication expired. Please log in again.");
          localStorage.removeItem('token');
          setPage("login");
      } else {
          alert(`Analysis Error: ${error.message || "Backend connection failed"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#0d001a] via-black to-[#200040]">
      
      <CinematicLoader isLoading={isLoading} />
      <div className="backdrop-blur-md bg-purple-900/10 
      border border-purple-500/20 
      p-8 rounded-xl shadow-lg w-[90%] max-w-lg">

        {/* Title */}
        <h2 className="text-2xl font-bold text-purple-300 text-center mb-6">
          Tell us about your idea 🚀
        </h2>

        {/* Idea Name */}
        <input
          type="text"
          placeholder="Startup Idea Name"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full p-3 mb-4 rounded-md 
          bg-black/40 text-white 
          border border-purple-500/20 
          focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {/* Idea Summary */}
        <textarea
          placeholder="Brief summary of your idea..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full p-3 mb-6 rounded-md 
          bg-black/40 text-white 
          border border-purple-500/20 
          focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows="4"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-md font-semibold 
          text-purple-300 
          bg-purple-500/10 backdrop-blur-md 
          border border-purple-400/20 
          hover:bg-purple-500/20 
          hover:shadow-[0_0_25px_rgba(128,0,255,0.4)] 
          transition duration-300
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
        >
          {isLoading ? "Analyzing..." : "Analyze Idea 🚀"}
        </button>
        {/* Secondary Navigation */}
        <div className="mt-6 flex justify-center">
          <button 
             onClick={() => setPage("dashboard")}
             className="text-gray-500 hover:text-purple-400 font-black uppercase tracking-widest text-[10px] transition-colors pb-1 border-b border-transparent hover:border-purple-500/50"
          >
             ← Back to Hub
          </button>
        </div>

      </div>
    </div>
  );
}

export default Input;