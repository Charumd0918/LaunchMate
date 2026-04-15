import React from "react";

function LearnMore({ setPage, section }) {
  // Common NavBar
  const NavBar = () => (
    <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-purple-900/30">
      <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex lg:flex-1">
          <span
            className="text-white font-bold text-xl cursor-pointer hover:text-purple-400 transition"
            onClick={() => setPage("home")}
          >
            LaunchMate 🚀
          </span>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
            <span
              onClick={() => setPage("product")}
              className={`text-sm font-semibold cursor-pointer transition ${section === 'product' ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
            >
              Product
            </span>
            <span
              onClick={() => setPage("features")}
              className={`text-sm font-semibold cursor-pointer transition ${section === 'features' ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
            >
              Features
            </span>
            <span
              onClick={() => setPage("about")}
              className={`text-sm font-semibold cursor-pointer transition ${section === 'about' ? 'text-purple-400' : 'text-white hover:text-purple-300'}`}
            >
              About
            </span>
        </div>

        <div className="flex flex-1 justify-end">
          <button
            onClick={() => setPage("home")}
            className="text-sm font-semibold text-purple-400 hover:text-white transition bg-purple-900/40 px-4 py-2 rounded-full border border-purple-500/20"
          >
            ← Back to Home
          </button>
        </div>
      </nav>
    </header>
  );

  const Footer = () => (
    <footer className="border-t border-purple-900/30 bg-black/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold text-white">LaunchMate</span>
          <p className="text-sm text-gray-500 mt-2">© 2026 LaunchMate Inc. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:hello@launchmate.io" className="text-gray-400 hover:text-purple-400 transition flex items-center gap-2">
            <span>📧</span> hello@launchmate.io
          </a>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d001a] via-[#000000] to-[#200040] text-white selection:bg-purple-500/30 flex flex-col">
      <NavBar />
      
      <main className="flex-grow max-w-5xl mx-auto px-6 py-20 w-full">
        
        {/* --- PRODUCT SECTION --- */}
        {(section === "product" || !section || section === "learn") && (
          <div className="space-y-16 animate-fade-in-up">
            <section className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                The AI Co-Founder
              </h1>
              <p className="text-2xl md:text-3xl font-medium text-gray-200">
                Instantly turn your idea into an actionable startup.
              </p>
              <div className="max-w-3xl mx-auto mt-6">
                <p className="text-lg text-gray-400 leading-relaxed">
                  LaunchMate is an advanced AI-powered application designed specifically for solo founders and startup builders. When you have a raw idea, the hardest part is executing the hundreds of structural tasks required to get it off the ground.
                </p>
                <br/>
                <p className="text-lg text-gray-400 leading-relaxed">
                  LaunchMate solves this by acting as your technical and business partner. You simply input your concept, and LaunchMate rapidly analyzes market demand, generates a formal business plan, writes your investor pitch, calculates your runway, and builds a comprehensive execution strategy.
                </p>
              </div>
            </section>

            <section className="relative px-8 py-16 rounded-3xl bg-purple-900/10 border border-purple-500/20 backdrop-blur-md shadow-2xl overflow-hidden text-center">
              <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-6">The Problem We Solve</h2>
              <p className="text-2xl md:text-4xl font-bold leading-tight text-white mb-6">
                Founders spend months writing business plans. We do it in 5 seconds.
              </p>
              <button onClick={() => setPage("input")} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full transition shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                 Start Building For Free
              </button>
            </section>
          </div>
        )}

        {/* --- FEATURES SECTION --- */}
        {section === "features" && (
          <div className="space-y-16 animate-fade-in-up">
            <div className="text-center">
              <h1 className="text-5xl border-b border-purple-500/20 pb-4 md:text-6xl font-extrabold tracking-tight text-white mb-8">
                Platform <span className="text-purple-400">Features</span>
              </h1>
              <p className="text-xl text-gray-400">Everything you need to launch, built into one dashboard.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">📊 Startup Health Score</h3>
                 <p className="text-gray-400 leading-relaxed">Instantly grade your idea on a 10-point scale. LaunchMate evaluates market demand, innovation level, and feasibility before you write a single line of code.</p>
              </div>
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">📋 Business Model Canvas</h3>
                 <p className="text-gray-400 leading-relaxed">Automatically generate detailed target audiences, revenue models, and problem/solution mappings to perfectly structure your operations.</p>
              </div>
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">🌍 Real Competitor Analysis</h3>
                 <p className="text-gray-400 leading-relaxed">LaunchMate scours the web to find 3 real-world companies doing exactly what you want to do, and highlights their weaknesses for you to exploit.</p>
              </div>
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">💰 Dynamic Budget Tool</h3>
                 <p className="text-gray-400 leading-relaxed">A fully interactive financial dashboard to tweak your server, marketing, and salary costs so you can instantly calculate your runway.</p>
              </div>
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">🚀 The Pitch Deck Link</h3>
                 <p className="text-gray-400 leading-relaxed">Not only does LaunchMate write your tagline and elevator pitch, but it lets you generate a secure read-only URL to send directly to investors.</p>
              </div>
              <div className="bg-[#140026] p-8 rounded-2xl border border-purple-500/20 shadow-lg">
                 <h3 className="text-2xl font-bold text-purple-300 mb-3">✅ Execution Kanban</h3>
                 <p className="text-gray-400 leading-relaxed">A built-in Trello-style board that breaks your timeline into Phase 1, 2, and 3, letting you drag and drop tasks as you execute.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- ABOUT SECTION --- */}
        {section === "about" && (
          <div className="space-y-16 animate-fade-in-up">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                About the <span className="text-purple-400">Founders</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                LaunchMate was architected by two engineers deeply passionate about democratizing the startup creation process.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24">
              
              {/* Charulatha */}
              <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-1.5 shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0d001a] rounded-full flex items-center justify-center overflow-hidden border-4 border-black">
                     <span className="text-5xl font-black text-white px-2 text-center leading-none">CM</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Charulatha M D</h3>
                  <p className="inline-block px-4 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-semibold text-sm mb-4">
                    Co-Founder & Fullstack Lead
                  </p>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Charulatha spearheaded the core architecture for LaunchMate. With a deep focus on creating scalable, user-friendly applications, she designed the seamless UX loops that allow founders to go from raw idea to fully-rendered dashboard in seconds.
                  </p>
                </div>
              </div>

              {/* Divya */}
              <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-1.5 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0d001a] rounded-full flex items-center justify-center overflow-hidden border-4 border-black">
                     <span className="text-5xl font-black text-white px-2 text-center leading-none">DK</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Divya K</h3>
                  <p className="inline-block px-4 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 font-semibold text-sm mb-4">
                    Co-Founder & AI Lead
                  </p>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Divya is the mastermind behind the AI integration. A passionate developer specializing in Machine Learning and backend execution architectures, she engineered the rigorous prompts and routing logic that power LaunchMate's incredible market analysis engine.
                  </p>
                </div>
              </div>

            </div>
            
            <div className="mt-24 p-8 bg-black/40 border border-purple-500/20 rounded-3xl text-center max-w-3xl mx-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                "We built LaunchMate because we saw too many brilliant ideas die in the notepad phase. We wanted to build a co-founder that is awake 24/7, ready to handle the business planning so you can focus on building the actual product."
              </p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default LearnMore;