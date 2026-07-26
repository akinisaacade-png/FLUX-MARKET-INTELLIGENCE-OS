import React, { useState } from 'react';
import { Layout, Type, Sparkles, Move, Edit3, Trash2, Plus, Eye, Save, Palette } from 'lucide-react';

interface CanvasSection {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'pricing';
  title: string;
  subtitle: string;
  buttonText: string;
}

export const CanvasEditorView: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState<string>('Plus Jakarta Sans');
  const [entryAnimation, setEntryAnimation] = useState<string>('Fade');
  const [editingSectionId, setEditingSectionId] = useState<string | null>('hero');

  const [sections, setSections] = useState<CanvasSection[]>([
    {
      id: 'hero',
      type: 'hero',
      title: 'FLUX MARKET INTELLIGENCE OS',
      subtitle: 'Orchestrating 4 specialist nodes for real-time market dominance. Neural search verification active.',
      buttonText: 'Start Neural Audit',
    },
    {
      id: 'features',
      type: 'features',
      title: 'Specialist Intelligence Nodes',
      subtitle: 'Competitor price tracking, search volume deltas, SEO keyword clusters, and brand crisis radar.',
      buttonText: 'Explore Nodes',
    },
    {
      id: 'cta',
      type: 'cta',
      title: 'Scale PPC ROAS to 5x+ with Autonomous Strategy AI',
      subtitle: 'Get automated weekly growth blueprints and real-time competitor alert feeds.',
      buttonText: 'Schedule Demo',
    },
  ]);

  const fontOptions = ['Plus Jakarta Sans', 'Inter', 'Space Grotesk', 'Playfair Display', 'Outfit', 'Roboto'];
  const animationOptions = ['Fade', 'Slide', 'Zoom', 'Bounce'];

  const handleUpdateText = (id: string, field: keyof CanvasSection, val: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: val } : sec))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...sections];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setSections(newArr);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newArr = [...sections];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setSections(newArr);
  };

  const handleAddSection = () => {
    const newId = `sec_${Date.now()}`;
    setSections((prev) => [
      ...prev,
      {
        id: newId,
        type: 'pricing',
        title: 'Enterprise Growth Tier',
        subtitle: 'Uncapped node execution, multi-tenant RBAC, and dedicated strategy agent.',
        buttonText: 'Upgrade Tier',
      },
    ]);
    setEditingSectionId(newId);
  };

  const getAnimationClass = () => {
    switch (entryAnimation) {
      case 'Slide':
        return 'animate-slide-in';
      case 'Zoom':
        return 'scale-95 animate-zoom-in';
      case 'Bounce':
        return 'animate-bounce';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <Layout className="h-6 w-6 text-orange-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Drag-and-Drop Site Canvas & Typography Studio
          </h2>
        </div>
        <p className="text-xs text-purple-300/70">
          Visual canvas editor for real-time landing page customization, Google Fonts pairing, section reordering, and entry animations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Control Studio Panel (Fonts, Animations, Sections) */}
        <div className="space-y-4 rounded-2xl border border-purple-900/40 bg-[#130D24]/90 p-5 shadow-xl text-xs">
          {/* Typography Customizer */}
          <div className="space-y-2 border-b border-purple-900/40 pb-4">
            <label className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Type className="h-4 w-4 text-orange-400" />
              <span>Global Google Typography</span>
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full rounded-xl bg-[#0B0713] border border-purple-800 p-2 text-white focus:border-orange-500 focus:outline-none"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Entry Animation Customizer */}
          <div className="space-y-2 border-b border-purple-900/40 pb-4">
            <label className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Section Entry Animation</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {animationOptions.map((anim) => (
                <button
                  key={anim}
                  onClick={() => setEntryAnimation(anim)}
                  className={`p-2 rounded-lg font-medium transition-colors border ${
                    entryAnimation === anim
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 font-bold'
                      : 'bg-[#0B0713] text-purple-300 border-purple-900/40 hover:text-white'
                  }`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>

          {/* Section Manager */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Palette className="h-4 w-4 text-amber-400" />
                <span>Reorder Canvas Sections</span>
              </label>
              <button
                onClick={handleAddSection}
                className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setEditingSectionId(sec.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    editingSectionId === sec.id
                      ? 'bg-gradient-to-r from-purple-900/60 to-orange-950/40 border-orange-500/80 shadow-md'
                      : 'bg-[#0B0713] border-purple-900/40 hover:border-purple-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[10px] font-mono">
                      {sec.type} Section
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveUp(idx);
                        }}
                        className="p-1 hover:text-orange-400 text-purple-400"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveDown(idx);
                        }}
                        className="p-1 hover:text-orange-400 text-purple-400"
                        title="Move Down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  {editingSectionId === sec.id && (
                    <div className="space-y-2 pt-2 border-t border-purple-900/60 text-xs">
                      <div>
                        <span className="text-purple-400/80 block text-[10px]">Title Text</span>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateText(sec.id, 'title', e.target.value)}
                          className="w-full rounded bg-[#130D24] border border-purple-800 p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-purple-400/80 block text-[10px]">Subtitle Text</span>
                        <textarea
                          rows={2}
                          value={sec.subtitle}
                          onChange={(e) => handleUpdateText(sec.id, 'subtitle', e.target.value)}
                          className="w-full rounded bg-[#130D24] border border-purple-800 p-1.5 text-white"
                        />
                      </div>
                      <div>
                        <span className="text-purple-400/80 block text-[10px]">Button CTA Label</span>
                        <input
                          type="text"
                          value={sec.buttonText}
                          onChange={(e) => handleUpdateText(sec.id, 'buttonText', e.target.value)}
                          className="w-full rounded bg-[#130D24] border border-purple-800 p-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Visual Canvas Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-purple-900/40 bg-[#0B0713] p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-purple-900/60 pb-3 text-xs">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-white">Live Render Visual Canvas</span>
            </div>
            <span className="font-mono text-purple-400/80 text-[11px]">
              Font: <span className="text-orange-400 font-bold">{selectedFont}</span> • Animation: <span className="text-purple-300 font-bold">{entryAnimation}</span>
            </span>
          </div>

          {/* Rendered Sections Canvas */}
          <div className="space-y-6" style={{ fontFamily: selectedFont }}>
            {sections.map((sec) => (
              <div
                key={sec.id}
                className={`relative rounded-2xl bg-gradient-to-br from-[#1C1236] via-[#130D24] to-[#0B0713] p-8 border border-purple-800/40 space-y-4 ${getAnimationClass()}`}
              >
                <div className="absolute top-3 right-3 text-[10px] font-mono text-purple-400/60 border border-purple-900 px-2 py-0.5 rounded">
                  {sec.type.toUpperCase()}
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {sec.title}
                </h2>

                <p className="text-sm text-purple-200/90 leading-relaxed max-w-2xl">
                  {sec.subtitle}
                </p>

                <div>
                  <button className="rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
                    {sec.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
