import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ReportTemplate = ({ data }) => {
  const [reportId] = useState(() => `LM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [reportDate] = useState(() => new Date().toLocaleDateString());

  if (!data || !data.blueprintMarkdown) return null;

  const { blueprintMarkdown, idea } = data;

  return (
    <div className="pdf-wrapper" style={{ background: '#05000a', padding: '0px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;0,900;1,900&display=swap');

        .pdf-container {
          width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          background: #05000a;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        /* --- COVER PAGE --- */
        .cover-page {
          height: 1123px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 100px;
          position: relative;
          background: radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .cover-brand {
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 6px;
          color: #a855f7;
          margin-bottom: 40px;
        }

        .cover-title {
          font-size: 64px;
          font-weight: 900;
          font-style: italic;
          line-height: 1;
          margin-bottom: 20px;
          text-transform: uppercase;
          max-width: 500px;
          border-left: 12px solid #a855f7;
          padding-left: 30px;
        }

        .cover-subtitle {
          font-size: 18px;
          color: #a1a1aa;
          letter-spacing: 1px;
          margin-top: 20px;
        }

        .cover-timestamp {
          position: absolute;
          bottom: 100px;
          left: 100px;
          font-size: 10px;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* --- CONTENT PAGE --- */
        .content-page {
          padding: 80px 100px;
          min-height: 1123px;
          position: relative;
        }

        .section-separator {
          page-break-before: always;
          padding-top: 60px;
        }

        /* --- TYPOGRAPHY --- */
        .markdown-rendered-content h1 { 
          font-size: 12px;
          color: #a855f7;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-top: 80px;
          margin-bottom: 10px;
          display: block;
        }

        .markdown-rendered-content h2 { 
          font-size: 32px; 
          font-weight: 900; 
          font-style: italic;
          color: #ffffff; 
          margin-top: 40px; 
          margin-bottom: 30px; 
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .markdown-rendered-content h2::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(168, 85, 247, 0.2);
        }

        .markdown-rendered-content h3 { 
          font-size: 20px; 
          color: #d8b4fe; 
          font-weight: 900; 
          margin-top: 30px; 
          margin-bottom: 15px; 
          text-transform: uppercase;
        }

        .markdown-rendered-content p { 
          margin-bottom: 24px; 
          color: #a1a1aa; 
          font-size: 16px;
          line-height: 1.8; 
          font-weight: 500; 
        }

        .markdown-rendered-content strong { color: #ffffff; font-weight: 700; }
        
        .markdown-rendered-content ul, .markdown-rendered-content ol { 
          margin-bottom: 30px; 
          padding-left: 20px; 
          color: #a1a1aa; 
        }
        .markdown-rendered-content li { margin-bottom: 14px; line-height: 1.6; }

        .markdown-rendered-content blockquote {
          background: rgba(168, 85, 247, 0.05);
          border-left: 4px solid #a855f7;
          padding: 30px;
          margin: 40px 0;
          border-radius: 0 20px 20px 0;
          color: #d8b4fe;
          font-size: 18px;
          font-style: italic;
        }

        .markdown-rendered-content hr {
          border: 0; height: 1px; background: rgba(255,255,255,0.05); margin: 60px 0;
        }

        /* --- FOOTER --- */
        .pdf-footer {
          margin-top: 100px;
          text-align: center;
          font-size: 10px;
          color: #3f3f46;
          text-transform: uppercase;
          letter-spacing: 4px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.03);
        }

        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .pdf-wrapper { padding: 0 !important; }
        }
      `}</style>

      <div className="pdf-container" id="printable-report">
        {/* COVER PAGE */}
        <div className="cover-page">
          <div className="cover-brand">LaunchMate Strategic Artifact</div>
          <h1 className="cover-title">{idea || "Tactical Idea"}</h1>
          <div className="cover-subtitle">High-Fidelity Master Blueprint & Architectural Audit</div>
          <div className="cover-timestamp">
            ID: {reportId} • Generated {reportDate}
          </div>
        </div>

        {/* CONTENT PAGES */}
        <div className="content-page">
          <div className="markdown-rendered-content">
            <ReactMarkdown>{blueprintMarkdown}</ReactMarkdown>
          </div>

          <div className="pdf-footer">
            Sovereign Core Connectivity • Verified Strategic Logic
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplate;
