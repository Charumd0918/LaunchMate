import { useState, useEffect, useRef } from "react";
import api from "./api";
import html2pdf from "html2pdf.js";
import { motion, AnimatePresence } from "framer-motion";

import BusinessStrategy from "./BusinessStrategy";
import Score from "./Score";
import Budget from "./Budget";
import MarketingAnalytics from "./MarketingAnalytics";
import Pitch from "./Pitch";
import RiskDetector from "./RiskDetector";
import ProgressGrowthTracker from "./ProgressTracker";
import KanbanBoard from "./KanbanBoard";
import Chatbot from "./Chatbot";
import ReportTemplate from "./ReportTemplate";
import IdeaPortfolio from "./IdeaPortfolio";
import Competitors from "./Competitors";
import FinancialHub from "./FinancialHub";
import LogoGenerator from "./LogoGenerator";
import CinematicLoader from "./CinematicLoader";

// Import Assets
import scoreImg from "./assets/score.png";
import strategyImg from "./assets/strategy.png";
import businessImg from "./assets/business.png";
import budgetImg from "./assets/budget.png";
import marketingImg from "./assets/marketing.png";
import pitchImg from "./assets/pitch.png";
import analyticsImg from "./assets/analytics.png";
import placeholderImg from "./assets/hero.png";
import riskImg from "./assets/risk.jpg";
import progressImg from "./assets/progress.jpg";
function Dashboard({ setPage, onLogout }) {
  const [activePage, setActivePage] = useState("main");
  const [latestIdea, setLatestIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [fetchingStep, setFetchingStep] = useState("");
  const [exportData, setExportData] = useState(null);
  
  const reportRef = useRef(null);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  useEffect(() => {
    const localIdea = localStorage.getItem("launchmate_active_idea");
    if (localIdea && !latestIdea) {
        setLatestIdea({ idea: localIdea });
    }

    const fetchLatestIdea = async () => {
      try {
        const response = await api.get("/ideas/latest");
        if (response.data.success && response.data.data) {
          setLatestIdea(response.data.data);
          localStorage.setItem("launchmate_active_idea", response.data.data.idea);
        }
      } catch (err) {
        console.error("Error fetching latest idea:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestIdea();
  }, []);

  const handleExportPDF = async () => {
    if (!latestIdea) {
      alert("No active startup idea found. Please start an analysis first.");
      return;
    }

    try {
      setIsExporting(true);
      const ideaStr = latestIdea.idea;
      const encodedIdea = encodeURIComponent(ideaStr);
      
      const fetchModule = async (endpoint, label) => {
        setFetchingStep(label);
        const res = await api.get(`${endpoint}?idea=${encodedIdea}`);
        return res.data;
      };

      const blueprintData = await fetchModule("/blueprint", "Compiling Executive Data...");
      
      if (!blueprintData.success) {
        throw new Error(blueprintData.error || "Tactical Engine Link Failure");
      }

      setFetchingStep("Drafting Professional Report...");
      
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const data = blueprintData.data;
      const margin = 20;
      const pageWidth = 210;
      const contentWidth = pageWidth - (margin * 2);
      const footerY = 285;
      let y = 20;

      // --- THEME ---
      const bgColor = { r: 5, g: 0, b: 10 };
      const brandColor = { r: 168, g: 85, b: 247 }; // Purple
      const textColor = { r: 210, g: 210, b: 210 };

      const applyBg = () => {
        doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
        doc.rect(0, 0, pageWidth, 297, "F");
      };

      const addFooter = () => {
        const pNum = doc.internal.getNumberOfPages();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`LaunchMate AI Strategic Report | Page ${pNum}`, margin, footerY);
        doc.text(new Date().toLocaleDateString(), pageWidth - margin, footerY, { align: "right" });
      };

      const checkPage = (needed) => {
        if (y + needed > footerY - 5) {
          doc.addPage();
          applyBg();
          y = 20;
          addFooter();
        }
      };

      // --- RENDER HELPERS ---
      const renderSection = (title, content) => {
        const lines = doc.splitTextToSize(content || "Data not available", contentWidth);
        const needed = (lines.length * 5) + 12;
        checkPage(needed);
        
        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.text(title.toUpperCase(), margin, y);
        y += 6;
        
        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        doc.setTextColor(textColor.r, textColor.g, textColor.b);
        doc.text(lines, margin, y);
        y += (lines.length * 5) + 6;
      };

      const renderList = (title, items) => {
        const itemLines = (items || []).flatMap(item => doc.splitTextToSize(`• ${item}`, contentWidth - 5));
        const needed = (itemLines.length * 5) + 12;
        checkPage(needed);

        doc.setFont("helvetica", "bold"); doc.setFontSize(11);
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.text(title.toUpperCase(), margin, y);
        y += 6;

        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        doc.setTextColor(textColor.r, textColor.g, textColor.b);
        (items || []).forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
          checkPage(lines.length * 5);
          doc.text(lines, margin + 4, y);
          y += (lines.length * 5) + 1;
        });
        y += 4;
      };

      // --- PAGE 1: COVER ---
      applyBg();
      addFooter();
      y = 100;
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
      doc.text("LAUNCHMATE STRATEGIC AUDIT", margin, y);
      y += 10;
      doc.setFontSize(22); doc.setTextColor(255, 255, 255);
      doc.text("Startup Analysis Report", margin, y);
      y += 10;
      doc.setFontSize(14); doc.setFont("helvetica", "italic"); doc.setTextColor(textColor.r, textColor.g, textColor.b);
      doc.text(data.cover.idea_name, margin, y);
      y += 10;
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(150, 150, 150);
      const summaryLines = doc.splitTextToSize(data.cover.summary, contentWidth);
      doc.text(summaryLines, margin, y);

      // --- PAGE 2: SUMMARY & STRATEGY ---
      doc.addPage(); applyBg(); addFooter();
      y = 20;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
      doc.text("EXECUTIVE OVERVIEW", margin, y);
      y += 10;
      renderSection("Problem Statement", data.executive_summary.problem);
      renderSection("The Solution", data.executive_summary.solution);
      renderSection("Market Positioning", data.executive_summary.target_audience);
      renderSection("Core Value Prop", data.executive_summary.unique_value);
      
      y += 4;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
      doc.text("BUSINESS STRATEGY", margin, y);
      y += 10;
      renderList("Revenue Models", data.business_strategy.revenue_streams);
      renderList("Market Growth", data.business_strategy.growth_strategy);
      renderList("Defensive Edge", data.business_strategy.competitive_advantage);

      // --- PAGE 3: EVALUATION & FINANCIALS ---
      doc.addPage(); applyBg(); addFooter();
      y = 20;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
      doc.text("STARTUP EVALUATION", margin, y);
      y += 10;
      renderSection("Success Probability", data.evaluation.success_score);
      renderSection("Market Demand", data.evaluation.market_demand);
      renderList("Key Strengths", data.evaluation.strengths);
      renderList("Strategic Risks", data.evaluation.risks);

      y += 4;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
      doc.text("FINANCIAL FRAMEWORK", margin, y);
      y += 10;
      renderSection("Startup Capital", data.financial_plan.initial_cost);
      renderSection("Operational Burn", data.financial_plan.monthly_expenses);
      renderSection("Pricing Strategy", data.financial_plan.pricing_model);
      renderSection("Profitability Path", data.financial_plan.break_even);

      // --- PAGE 4: ROADMAP & ACTION ---
      doc.addPage(); applyBg(); addFooter();
      y = 20;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(255, 255, 255);
      doc.text("EXECUTION ROADMAP", margin, y);
      y += 10;
      data.roadmap.forEach((item, idx) => {
        checkPage(25);
        doc.setDrawColor(40, 40, 40); doc.line(margin, y - 4, pageWidth - margin, y - 4);
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.text(item.step.toUpperCase(), margin, y);
        y += 5;
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(textColor.r, textColor.g, textColor.b);
        const rLines = doc.splitTextToSize(item.action, contentWidth);
        doc.text(rLines, margin, y);
        y += (rLines.length * 5) + 6;
      });

      y += 6;
      renderSection("Strategic Conclusion", data.final_insight.conclusion);
      
      checkPage(30);
      doc.setFillColor(30, 30, 60); doc.rect(margin - 4, y - 4, contentWidth + 8, 22, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(192, 132, 252);
      doc.text("CRITICAL NEXT STEP:", margin, y + 4);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
      doc.text(data.final_insight.next_step, margin, y + 10);

      doc.save(`LaunchMate_${ideaStr.replace(/\s+/g, '_')}_Strategic_Audit.pdf`);
      setIsExporting(false);
      setFetchingStep("");

    } catch (err) {
      console.error("Export Error:", err);
      alert(`Export Protocol Failed: ${err.message || 'Check network connection.'}`);
      setIsExporting(false);
      setFetchingStep("");
    }
  };

  // TOOL LIST CONFIGURATION
  const toolCards = [
    { id: "score", title: "Success Reader", desc: "Demand, competition & feasibility score.", img: scoreImg, color: "from-purple-500/20" },
    { id: "business_strategy", title: "Business Strategy", desc: "Problem, solution & business model.", img: businessImg, color: "from-indigo-500/20" },
    { id: "financial_hub", title: "Financial Hub", desc: "Costs, revenue & break-even insights.", img: budgetImg, color: "from-emerald-500/20" },
    { id: "kanban", title: "Launch Plan", desc: "Phase-wise roadmap & actionable tasks.", img: strategyImg, color: "from-blue-500/20" },
    { id: "pitch", title: "Pitch Deck", img: pitchImg, desc: "Tagline, elevator & investor pitch.", color: "from-amber-500/20" },
    { id: "marketing_analytics", title: "Marketing AI", img: marketingImg, desc: "Growth hacks & outreach strategies.", color: "from-red-500/20" },
    { id: "competitors", title: "Market Intel", img: analyticsImg, desc: "Competitors, trends & opportunity gaps.", color: "from-sky-500/20" },
    { id: "risk", title: "Risk Detector", img: riskImg, desc: "Risks, severity & mitigation plans.", color: "from-orange-500/20" },
    { id: "progress", title: "Growth Tracker", img: progressImg, desc: "Milestones, KPIs & growth checkpoints.", color: "from-violet-500/20" },
  ];


  const renderContent = () => {
    switch(activePage) {
      case "portfolio": return <IdeaPortfolio setActivePage={setActivePage} setLatestIdea={setLatestIdea} />;
      case "kanban": return <KanbanBoard setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "business_strategy": return <BusinessStrategy setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "score": return <Score setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "financial_hub": return <FinancialHub setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "marketing_analytics": return <MarketingAnalytics setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "competitors": return <Competitors setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "pitch": return <Pitch setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "risk": return <RiskDetector setActivePage={setActivePage} idea={latestIdea?.idea} />;
      case "progress": return <ProgressGrowthTracker setActivePage={setActivePage} idea={latestIdea?.idea} />;
      default: return (
        <div className="pt-24 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white tracking-widest uppercase italic mb-4"
            >
              Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Hub</span>
            </motion.h1>
            <p className="text-gray-400 text-xl font-medium">Your high-fidelity startup command station.</p>
          </div>

          {/* ACTIVE IDEA BANNER */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900/10 border border-purple-500/20 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-all"></div>
             <div className="relative z-10">
                <h2 className="text-sm font-black text-purple-400 uppercase tracking-[0.4em] mb-4 font-mono">Active Strategy</h2>
                {latestIdea ? (
                  <h3 className="text-3xl font-black text-white max-w-xl italic tracking-tight">{latestIdea.idea}</h3>
                ) : <p className="text-gray-500 font-medium text-lg">No active idea selected.</p>}
             </div>
             <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button 
                   onClick={() => {
                       localStorage.removeItem("launchmate_active_idea");
                       localStorage.removeItem("launchmate_analysis_data");
                       setPage("input");
                   }}
                   className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all backdrop-blur-md border border-emerald-500/20 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                   ⚡ New Idea
                </button>
                <button 
                   onClick={() => setActivePage("portfolio")}
                   className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all backdrop-blur-md border border-white/10 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                   📜 History
                </button>
                <button 
                   onClick={handleExportPDF}
                   disabled={!latestIdea || isExporting}
                   className="bg-purple-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 whitespace-nowrap shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                   {isExporting ? "Compiling..." : "📄 Export"}
                </button>
             </div>
          </motion.div>

          {/* FEATURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCards.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10, scale: 1.02, borderColor: 'rgba(168, 85, 247, 0.4)' }}
                onClick={() => setActivePage(tool.id)}
                className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] cursor-pointer group transition-all relative overflow-hidden shadow-2xl h-full flex flex-col justify-between"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div>
                   <div className="mb-8 relative z-10 overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
                      <img 
                        src={tool.img} 
                        alt={tool.title} 
                        className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                   </div>
                   <div className="relative z-10">
                      <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-purple-300 transition-colors uppercase italic">{tool.title}</h3>
                      <p className="text-gray-300 text-base leading-relaxed font-medium">{tool.desc}</p>
                   </div>
                </div>

                <div className="absolute bottom-10 right-10 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 pt-10 border-t border-white/5 flex justify-center">
             <button onClick={onLogout} className="text-gray-500 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-colors">
                Sign Out of Command Station
             </button>
          </div>

        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#05000a] text-white selection:bg-purple-500 selection:text-white">
      

      {/* CONTENT AREA */}
      <main>
         <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
               {renderContent()}
            </motion.div>
         </AnimatePresence>
      </main>

      {/* EXPORT OVERLAY */}
      <CinematicLoader isLoading={isExporting} />

      {latestIdea && <Chatbot idea={latestIdea.idea} />}

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
      `}</style>
    </div>
  );
}

export default Dashboard;