import { useState, useEffect } from "react";
import api from "./api";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function FinancialHub({ setActivePage, idea }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/financial-hub?idea=${encodeURIComponent(idea)}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("Could not calculate financials.");
        }
      } catch (err) {
        console.error("Error fetching financial hub:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (idea) fetchFinancials();
  }, [idea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="text-amber-400 font-mono animate-pulse tracking-widest uppercase text-sm">Computing Fiscal Blueprint...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-20">
        <p className="text-red-500 font-mono mb-4">FAILED TO GENERATE FINANCIAL MODEL.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold uppercase hover:bg-white/10">Retry Analysis</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05000a] text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-6xl mb-12">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Financial Hub</h1>
        <p className="text-amber-500 font-mono text-sm uppercase tracking-[0.4em]">Simple Fiscal Planning & Revenue Logic</p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Initial Cost & Pricing */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* 1. Initial Cost Highlight */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-4xl font-black">START</div>
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-4">Estimated Initial Cost</h3>
            <div className="text-5xl font-black text-white mb-4 tracking-tighter">₹{data.initial_cost.amount}</div>
            <p className="text-gray-200 text-lg leading-relaxed italic font-medium">"{data.initial_cost.description}"</p>
          </div>

          {/* 3. Pricing Box */}
          <div className="p-8 rounded-[2.5rem] bg-indigo-950/20 border border-indigo-500/20 relative group">
             <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 font-mono">Suggested Pricing</h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-black text-sm uppercase tracking-widest">
                   {data.pricing.model}
                </div>
                <div className="text-3xl font-black text-white font-mono">₹{data.pricing.price}</div>
             </div>
             <p className="text-gray-200 text-lg leading-relaxed italic border-l-4 border-indigo-500/30 pl-4">
                "{data.pricing.reason}"
             </p>
          </div>

          {/* 4. Break-even Timeline */}
          <div className="p-8 rounded-[2.5rem] bg-emerald-950/20 border border-emerald-500/20">
             <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-6 font-mono">Break-even Horizon</h3>
             <div className="flex items-center gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">⏱</span>
                <span className="text-2xl font-black text-white">{data.break_even.time}</span>
             </div>
             <p className="text-gray-200 text-lg leading-relaxed italic">
                {data.break_even.description}
             </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Expenses & Chart */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Monthly Expenses & Visual Data */}
           <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden h-full flex flex-col">
              <div className="text-gray-500 text-sm font-black uppercase tracking-widest mb-10 text-center font-mono underline decoration-amber-500/50 underline-offset-8">
                 Monthly Expenses Breakdown
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                 {/* List Side */}
                 <div className="space-y-6">
                    {data.monthly_expenses.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-black/40 border border-white/5 group hover:border-amber-500/20 transition-all">
                        <div>
                          <p className="text-sm font-black text-gray-400 uppercase tracking-tighter mb-1">{item.category}</p>
                          <p className="text-2xl font-black text-white font-mono">₹{item.cost}</p>
                        </div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      </div>
                    ))}
                    
                    {/* Financial Summary */}
                    <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-dashed border-white/10">
                      <h4 className="text-sm font-black text-gray-500 uppercase mb-4 tracking-widest">Co-Founder Audit Summary</h4>
                      <p className="text-lg text-gray-200 leading-relaxed italic font-medium">"{data.financial_summary}"</p>
                    </div>
                 </div>

                 {/* Chart Side */}
                 <div className="h-full min-h-[350px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                       <PieChart>
                          <Pie
                            data={data.visual_data.expense_chart}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {data.visual_data.expense_chart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#05000a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                             itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Comparison Bar */}
                    <div className="w-full mt-10 space-y-4">
                       <h4 className="text-xs font-black text-gray-500 uppercase text-center tracking-widest">Growth Potential (Cost vs Revenue)</h4>
                       <div className="space-y-3">
                          <div className="flex items-center gap-6">
                             <span className="text-xs font-black text-gray-600 w-20 uppercase">Initial</span>
                             <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" style={{ width: '40%' }}></div>
                             </div>
                             <span className="text-sm font-black text-amber-500 w-20 text-right">₹{data.visual_data.cost_vs_revenue.cost}</span>
                          </div>
                          <div className="flex items-center gap-6">
                             <span className="text-xs font-black text-gray-600 w-20 uppercase">Expected</span>
                             <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: '100%' }}></div>
                             </div>
                             <span className="text-sm font-black text-emerald-500 w-20 text-right">₹{data.visual_data.cost_vs_revenue.expected_revenue}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <div className="mt-16 pt-10 border-t border-white/5 w-full max-w-6xl flex justify-center">
         <button 
           onClick={() => setActivePage("main")}
           className="px-12 py-4 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
         >
           Confirm Strategy
         </button>
      </div>

    </div>
  );
}

export default FinancialHub;
