import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Network, ArrowRight, Activity, ShieldAlert, CheckCircle2, Hospital } from 'lucide-react';

export default function SchemaVisualizer() {
  const [schemaData, setSchemaData] = useState(null);

  useEffect(() => {
    axios
      .get('/api/analytics/triage-schema')
      .then((res) => {
        if (res.data.success) {
          setSchemaData(res.data.schema);
        }
      })
      .catch((err) => console.warn('Schema fetch error:', err));
  }, []);

  if (!schemaData) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <Network className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">ToDiagram Interactive Health Referral Network</h2>
          <p className="text-xs text-slate-400">Live Architectural Schema of Ethiopian Rural-to-Regional Patient Flow</p>
        </div>
      </div>

      {/* Nodes and Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schemaData.nodes.map((node) => (
          <div
            key={node.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-transform hover:scale-102 ${
              node.type === 'urgency-red'
                ? 'bg-rose-950/60 border-rose-600/80 text-rose-200'
                : node.type === 'processor'
                ? 'bg-teal-950/60 border-teal-600/80 text-teal-200'
                : node.type === 'destination'
                ? 'bg-amber-950/60 border-amber-600/80 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">NODE #{node.id}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                {node.type}
              </span>
            </div>
            <h4 className="text-sm font-bold">{node.label}</h4>
          </div>
        ))}
      </div>

      {/* Edges List */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Network Decision Logic Edges</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {schemaData.edges.map((edge, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-slate-300">
              <span className="font-mono text-teal-400">Node #{edge.from} → Node #{edge.to}</span>
              <span className="text-amber-300 font-semibold">{edge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
