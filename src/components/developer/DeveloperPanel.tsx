import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { settingsService, type Settings } from '../../services/settingsService';

interface DeveloperPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function DeveloperPanel({ isOpen, onClose }: DeveloperPanelProps) {
  const [settings, setSettings] = useState<Settings>(settingsService.getSettings());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(settingsService.getSettings());
    }
  }, [isOpen]);

  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings)); // Deep clone
    let current: any = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
    
    // Update settingsService with the updated value
    if (path === 'particles.count') {
      settingsService.updateParticleCount(value);
    } else if (path === 'features.keyboardAnimation.enabled') {
      settingsService.updateSettings({ features: newSettings.features });
    } else if (path === 'features.developerMode.enabled') {
      settingsService.updateSettings({ features: newSettings.features });
    } else if (path === 'features.tubesCursor.enabled') {
      settingsService.updateSettings({ features: newSettings.features });
    } else if (path === 'features.editorMode.enabled') {
      settingsService.updateSettings({ features: newSettings.features });
    } else if (path === 'languages.enabled') {
      settingsService.updateSettings({ languages: newSettings.languages });
    } else if (path === 'languages.default') {
      settingsService.updateSettings({ languages: newSettings.languages });
    } else if (path === 'cardStyle.projectCardStyle.selected') {
      settingsService.updateProjectCardStyle(value);
      setSettings({
        ...settings,
        cardStyle: {
          ...settings.cardStyle,
          projectCardStyle: { ...settings.cardStyle.projectCardStyle, selected: value },
        },
      });
    } else if (path === 'cardStyle.teamCardStyle.selected') {
      settingsService.updateTeamCardStyle(value);
      setSettings({
        ...settings,
        cardStyle: {
          ...settings.cardStyle,
          teamCardStyle: { ...settings.cardStyle.teamCardStyle, selected: value },
        },
      });
    } else {
      // Fallback: update entire settings
      settingsService.updateSettings(newSettings);
    }
  };

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(settings, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-bolf-black/80 backdrop-blur-sm" />

        {/* Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-bolf-black/90 backdrop-blur-md border-2 border-bolf-neon-blue/40 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-bolf-black/95 backdrop-blur-md border-b border-bolf-neon-blue/40 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-bolf-white">Developer Panel</h2>
            <button
              onClick={onClose}
              className="text-bolf-white hover:text-bolf-neon-blue transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Features */}
            <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
              <h3 className="text-xl font-bold text-bolf-neon-blue mb-4">Features</h3>
              
              <div className="space-y-4">
                {/* Keyboard Animation */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-bolf-white font-medium">
                      {settings.features.keyboardAnimation.description}
                    </label>
                  </div>
                  <button
                    onClick={() => updateSettings('features.keyboardAnimation.enabled', !settings.features.keyboardAnimation.enabled)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.features.keyboardAnimation.enabled
                        ? 'bg-bolf-neon-blue'
                        : 'bg-bolf-gray/30'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-bolf-white rounded-full transition-transform ${
                        settings.features.keyboardAnimation.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                    {/* Developer Mode */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-bolf-white font-medium">
                          {settings.features.developerMode.description}
                        </label>
                      </div>
                      <button
                        onClick={() => updateSettings('features.developerMode.enabled', !settings.features.developerMode.enabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.features.developerMode.enabled
                            ? 'bg-bolf-neon-blue'
                            : 'bg-bolf-gray/30'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-bolf-white rounded-full transition-transform ${
                            settings.features.developerMode.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Tubes Cursor */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-bolf-white font-medium">
                          {settings.features.tubesCursor.description}
                        </label>
                      </div>
                      <button
                        onClick={() => updateSettings('features.tubesCursor.enabled', !settings.features.tubesCursor.enabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.features.tubesCursor.enabled
                            ? 'bg-bolf-neon-blue'
                            : 'bg-bolf-gray/30'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-bolf-white rounded-full transition-transform ${
                            settings.features.tubesCursor.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Mode */}
                <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-bolf-orange mb-1">Editor Mode</h3>
                      <p className="text-sm text-bolf-gray">
                        {settings.features.editorMode?.description || 'Editor paneli ve içerik yönetim özelliklerini etkinleştir'}
                      </p>
                    </div>
                    <button
                      onClick={() => updateSettings('features.editorMode.enabled', !settings.features.editorMode?.enabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings.features.editorMode?.enabled
                          ? 'bg-bolf-orange'
                          : 'bg-bolf-gray/30'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-bolf-white rounded-full transition-transform ${
                          settings.features.editorMode?.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* TubesCursor */}
                <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
                  <h3 className="text-xl font-bold text-bolf-neon-blue mb-4">Tubes Cursor</h3>
                  <div className="space-y-4">
                    {/* Cursor Colors */}
                    <div>
                      <label className="text-bolf-white font-medium block mb-2">Colors</label>
                      <div className="space-y-2">
                        {settings.tubesCursor.colors.map((color, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...settings.tubesCursor.colors];
                                newColors[index] = e.target.value;
                                settingsService.updateTubesCursorSettings({ colors: newColors });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, colors: newColors } });
                              }}
                              className="w-10 h-10 rounded cursor-pointer border border-bolf-white/20"
                            />
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...settings.tubesCursor.colors];
                                newColors[index] = e.target.value;
                                settingsService.updateTubesCursorSettings({ colors: newColors });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, colors: newColors } });
                              }}
                              className="flex-1 px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white text-sm"
                              placeholder="#f967fb"
                            />
                            <button
                              onClick={() => {
                                const newColors = settings.tubesCursor.colors.filter((_, i) => i !== index);
                                settingsService.updateTubesCursorSettings({ colors: newColors });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, colors: newColors } });
                              }}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-bolf-white rounded text-sm transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newColors = [...settings.tubesCursor.colors, '#FFFFFF'];
                            settingsService.updateTubesCursorSettings({ colors: newColors });
                            setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, colors: newColors } });
                          }}
                          className="w-full px-3 py-2 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white rounded text-sm transition-colors"
                        >
                          + Add Color
                        </button>
                      </div>
                    </div>

                    {/* Lights Colors */}
                    <div>
                      <label className="text-bolf-white font-medium block mb-2">Lights Colors</label>
                      <div className="space-y-2">
                        {settings.tubesCursor.lights.colors.map((color, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...settings.tubesCursor.lights.colors];
                                newColors[index] = e.target.value;
                                settingsService.updateTubesCursorSettings({ lights: { ...settings.tubesCursor.lights, colors: newColors } });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, lights: { ...settings.tubesCursor.lights, colors: newColors } } });
                              }}
                              className="w-10 h-10 rounded cursor-pointer border border-bolf-white/20"
                            />
                            <input
                              type="text"
                              value={color}
                              onChange={(e) => {
                                const newColors = [...settings.tubesCursor.lights.colors];
                                newColors[index] = e.target.value;
                                settingsService.updateTubesCursorSettings({ lights: { ...settings.tubesCursor.lights, colors: newColors } });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, lights: { ...settings.tubesCursor.lights, colors: newColors } } });
                              }}
                              className="flex-1 px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white text-sm"
                              placeholder="#83f36e"
                            />
                            <button
                              onClick={() => {
                                const newColors = settings.tubesCursor.lights.colors.filter((_, i) => i !== index);
                                settingsService.updateTubesCursorSettings({ lights: { ...settings.tubesCursor.lights, colors: newColors } });
                                setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, lights: { ...settings.tubesCursor.lights, colors: newColors } } });
                              }}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-bolf-white rounded text-sm transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newColors = [...settings.tubesCursor.lights.colors, '#FFFFFF'];
                            settingsService.updateTubesCursorSettings({ lights: { ...settings.tubesCursor.lights, colors: newColors } });
                            setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, lights: { ...settings.tubesCursor.lights, colors: newColors } } });
                          }}
                          className="w-full px-3 py-2 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white rounded text-sm transition-colors"
                        >
                          + Add Light Color
                        </button>
                      </div>
                    </div>

                    {/* Lights Intensity */}
                    <div>
                      <label className="text-bolf-white font-medium block mb-2">
                        Lights Intensity: {settings.tubesCursor.lights.intensity}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={settings.tubesCursor.lights.intensity}
                        onChange={(e) => {
                          const intensity = parseInt(e.target.value);
                          settingsService.updateTubesCursorSettings({ lights: { ...settings.tubesCursor.lights, intensity } });
                          setSettings({ ...settings, tubesCursor: { ...settings.tubesCursor, lights: { ...settings.tubesCursor.lights, intensity } } });
                        }}
                        className="w-full h-2 bg-bolf-gray/30 rounded-lg appearance-none cursor-pointer accent-bolf-neon-blue"
                      />
                      <div className="flex justify-between text-xs text-bolf-gray mt-1">
                        <span>0</span>
                        <span>500</span>
                      </div>
                    </div>
                  </div>
                </div>

            {/* Particles */}
            <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
              <h3 className="text-xl font-bold text-bolf-orange mb-4">Particles</h3>
              
              <div className="space-y-4">
                {/* Particle Count */}
                <div>
                  <label className="text-bolf-white font-medium block mb-2">
                    Count: {settings.particles.count}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={settings.particles.count}
                    onChange={(e) => updateSettings('particles.count', parseInt(e.target.value))}
                    className="w-full h-2 bg-bolf-gray/30 rounded-lg appearance-none cursor-pointer accent-bolf-neon-blue"
                  />
                  <div className="flex justify-between text-xs text-bolf-gray mt-1">
                    <span>0</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Particle Colors */}
                <div>
                  <label className="text-bolf-white font-medium block mb-2">Particle Colors</label>
                  <div className="space-y-3">
                    {settings.particles.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => {
                            const newColors = [...settings.particles.colors];
                            newColors[index].name = e.target.value;
                            settingsService.updateParticleColors(newColors);
                            setSettings({ ...settings, particles: { ...settings.particles, colors: newColors } });
                          }}
                          className="w-24 px-2 py-1 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white text-sm"
                          placeholder="Color name"
                        />
                        <input
                          type="color"
                          value={color.value}
                          onChange={(e) => {
                            const newColors = [...settings.particles.colors];
                            newColors[index].value = e.target.value;
                            settingsService.updateParticleColors(newColors);
                            setSettings({ ...settings, particles: { ...settings.particles, colors: newColors } });
                          }}
                          className="w-10 h-10 rounded cursor-pointer border border-bolf-white/20"
                        />
                        <input
                          type="text"
                          value={color.value}
                          onChange={(e) => {
                            const newColors = [...settings.particles.colors];
                            newColors[index].value = e.target.value;
                            settingsService.updateParticleColors(newColors);
                            setSettings({ ...settings, particles: { ...settings.particles, colors: newColors } });
                          }}
                          className="flex-1 px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white text-sm"
                          placeholder="#00BFFF"
                        />
                        <button
                          onClick={() => {
                            const newColors = settings.particles.colors.filter((_, i) => i !== index);
                            settingsService.updateParticleColors(newColors);
                            setSettings({ ...settings, particles: { ...settings.particles, colors: newColors } });
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-bolf-white rounded text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newColors = [...settings.particles.colors, { name: 'new', value: '#FFFFFF' }];
                        settingsService.updateParticleColors(newColors);
                        setSettings({ ...settings, particles: { ...settings.particles, colors: newColors } });
                      }}
                      className="w-full px-3 py-2 bg-bolf-neon-blue hover:bg-bolf-neon-blue/80 text-bolf-white rounded text-sm transition-colors"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Style */}
            <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
              <h3 className="text-xl font-bold text-bolf-orange mb-4">Card Styles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-bolf-white font-medium block mb-2">
                    {settings.cardStyle.projectCardStyle.description || 'Ortak Projeler Kart Stili'}
                  </label>
                  <select
                    value={settings.cardStyle.projectCardStyle.selected}
                    onChange={(e) => {
                      const newSelected = e.target.value;
                      settingsService.updateProjectCardStyle(newSelected);
                      setSettings({
                        ...settings,
                        cardStyle: {
                          ...settings.cardStyle,
                          projectCardStyle: { ...settings.cardStyle.projectCardStyle, selected: newSelected },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white"
                  >
                    {settings.cardStyle.projectCardStyle.options.map((option) => (
                      <option key={option} value={option}>
                        {option === 'default' ? 'Default (Mevcut)' : 
                         option === 'glow' ? 'Glow Effect' :
                         option === 'interaction' ? 'Card Interaction' :
                         option === '3d' ? '3D Card' :
                         option === 'nft' ? 'NFT Card' : option}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-bolf-white font-medium block mb-2">
                    {settings.cardStyle.teamCardStyle.description || 'Takım Üyeleri Kart Stili'}
                  </label>
                  <select
                    value={settings.cardStyle.teamCardStyle.selected}
                    onChange={(e) => {
                      const newSelected = e.target.value;
                      settingsService.updateTeamCardStyle(newSelected);
                      setSettings({
                        ...settings,
                        cardStyle: {
                          ...settings.cardStyle,
                          teamCardStyle: { ...settings.cardStyle.teamCardStyle, selected: newSelected },
                        },
                      });
                    }}
                    className="w-full px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white"
                  >
                    {settings.cardStyle.teamCardStyle.options.map((option) => (
                      <option key={option} value={option}>
                        {option === 'default' ? 'Default (Mevcut)' : 
                         option === 'glow' ? 'Glow Effect' :
                         option === 'interaction' ? 'Card Interaction' :
                         option === '3d' ? '3D Card' :
                         option === 'nft' ? 'NFT Card' : option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-bolf-black/50 rounded-lg p-4 border border-bolf-white/10">
              <h3 className="text-xl font-bold text-bolf-white mb-4">Languages</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-bolf-white font-medium block mb-2">Enabled Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {['tr', 'en', 'de', 'fr', 'es', 'ja', 'zh'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          const enabled = settings.languages.enabled;
                          const newEnabled = enabled.includes(lang)
                            ? enabled.filter((l) => l !== lang)
                            : [...enabled, lang];
                          updateSettings('languages.enabled', newEnabled);
                        }}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          settings.languages.enabled.includes(lang)
                            ? 'bg-bolf-neon-blue text-bolf-white'
                            : 'bg-bolf-gray/20 text-bolf-gray'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-bolf-white font-medium block mb-2">Default Language</label>
                  <select
                    value={settings.languages.default}
                    onChange={(e) => updateSettings('languages.default', e.target.value)}
                    className="w-full px-3 py-2 bg-bolf-black border border-bolf-white/20 rounded text-bolf-white"
                  >
                    {settings.languages.enabled.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Copy JSON Button */}
            <div className="sticky bottom-0 bg-bolf-black/95 backdrop-blur-md border-t border-bolf-neon-blue/40 p-4 -mx-6 -mb-6 mt-6">
              <button
                onClick={copyToClipboard}
                className="w-full px-6 py-3 bg-gradient-to-r from-bolf-neon-blue to-bolf-orange text-bolf-white font-bold rounded-lg hover:from-bolf-neon-blue/80 hover:to-bolf-orange/80 transition-all"
              >
                {copied ? '✓ JSON Kopyalandı!' : 'JSON\'ı Kopyala'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeveloperPanel;

