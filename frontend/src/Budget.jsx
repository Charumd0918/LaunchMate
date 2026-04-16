import { useState } from "react";

function Budget() {
  const [startingCapital, setStartingCapital] = useState(500000); // Default ₹5,00,000
  
  // Monthly costs
  const [servers, setServers] = useState(10000);
  const [marketing, setMarketing] = useState(25000);
  const [salaries, setSalaries] = useState(80000);
  const [misc, setMisc] = useState(15000);

  const totalMonthlyBurn = servers + marketing + salaries + misc;
  const runway = totalMonthlyBurn === 0 ? 999 : (startingCapital / totalMonthlyBurn).toFixed(1);

  const formatIN = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-[#0d001a] via-black to-[#200040] text-white flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-6">
      </div>

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-300 mb-2">Dynamic Budget Calculator 💰</h1>
        <p className="text-gray-400">Play with the sliders to calculate your startup runway.</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SLIDERS COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#140026] p-6 rounded-2xl border border-purple-500/20 shadow-lg">
            
            {/* Capital */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-purple-400 uppercase tracking-widest">Starting Capital</label>
                <span className="font-mono text-xl text-white font-bold">{formatIN(startingCapital)}</span>
              </div>
              <input 
                type="range" min="50000" max="5000000" step="50000" value={startingCapital}
                onChange={(e) => setStartingCapital(Number(e.target.value))}
                className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <hr className="border-purple-500/10 mb-8" />

            <h3 className="text-lg font-semibold text-white mb-6">Monthly Burn Rate Settings</h3>

            {/* Servers */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">Servers & Infrastructure</label>
                <span className="font-mono text-gray-200">{formatIN(servers)}/mo</span>
              </div>
              <input 
                type="range" min="0" max="100000" step="5000" value={servers}
                onChange={(e) => setServers(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            {/* Marketing */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">Marketing & Ads</label>
                <span className="font-mono text-gray-200">{formatIN(marketing)}/mo</span>
              </div>
              <input 
                type="range" min="0" max="500000" step="10000" value={marketing}
                onChange={(e) => setMarketing(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
            </div>

            {/* Salaries */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">Salaries & Contractors</label>
                <span className="font-mono text-gray-200">{formatIN(salaries)}/mo</span>
              </div>
              <input 
                type="range" min="0" max="1000000" step="20000" value={salaries}
                onChange={(e) => setSalaries(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Misc */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-300">Miscellaneous Legal & Ops</label>
                <span className="font-mono text-gray-200">{formatIN(misc)}/mo</span>
              </div>
              <input 
                type="range" min="0" max="100000" step="5000" value={misc}
                onChange={(e) => setMisc(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-400"
              />
            </div>

          </div>
        </div>

        {/* RESULTS COLUMN */}
        <div className="space-y-6">
          <div className="bg-[#1a0033] p-8 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
            
            <h3 className="text-purple-400 uppercase tracking-widest text-sm font-bold mb-2 relative z-10">Total Burn Rate</h3>
            <p className="text-3xl font-mono text-white mb-8 relative z-10">{formatIN(totalMonthlyBurn)}<span className="text-sm text-gray-400">/mo</span></p>
            
            <hr className="border-purple-500/20 mb-8" />
            
            <h3 className="text-purple-400 uppercase tracking-widest text-sm font-bold mb-2 relative z-10">Estimated Runway</h3>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-400 relative z-10">{runway}</p>
            <p className="text-gray-400 mt-2 relative z-10 uppercase tracking-wider text-sm font-semibold">Months</p>

            {runway < 3 && totalMonthlyBurn > 0 && (
              <p className="mt-6 text-xs text-red-400 bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                Warning: Extremely low runway. Consider raising more capital or cutting marketing burn.
              </p>
            )}
            {runway > 18 && (
              <p className="mt-6 text-xs text-green-400 bg-green-900/20 p-2 rounded-lg border border-green-500/20">
                Healthy runway. You have plenty of time to find product-market fit.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Budget;