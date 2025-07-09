'use client';

import { useState, useEffect } from 'react';

export interface EditorSettings {
  // Editor
  theme: 'vs-dark' | 'light';
  fontSize: number;
  tabSize: number;
  lineNumbers: 'on' | 'off';
  wordWrap: 'on' | 'off';
  minimap: boolean;
  
  // Behavior
  formatOnSave: boolean;
  autoSave: boolean;
  defaultLayout: 'split' | 'editor' | 'preview';
  consoleClear: boolean;
  errorHighlight: boolean;
  
  // Advanced
  strictMode: boolean;
  importSuggestions: boolean;
  hotReload: boolean;
}

const defaultSettings: EditorSettings = {
  // Editor
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  lineNumbers: 'on',
  wordWrap: 'on',
  minimap: true,
  
  // Behavior
  formatOnSave: false,
  autoSave: true,
  defaultLayout: 'split',
  consoleClear: false,
  errorHighlight: true,
  
  // Advanced
  strictMode: false,
  importSuggestions: true,
  hotReload: true,
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<EditorSettings>(settings);
  const [activeTab, setActiveTab] = useState<'editor' | 'behavior' | 'advanced' | 'storage'>('editor');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    console.log('SettingsPanel isOpen:', isOpen);
  }, [isOpen]);

  const handleSettingChange = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-xl w-96 max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-lg font-semibold text-[#cccccc]">Settings</h2>
          <button
            onClick={onClose}
            className="text-[#858585] hover:text-[#cccccc] text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3e3e42]">
          {[
            { key: 'editor', label: 'Editor', title: 'Editor Settings' },
            { key: 'behavior', label: 'Behavior', title: 'Workflow & Behavior' },
            { key: 'advanced', label: 'Advanced', title: 'Advanced Features' },
            { key: 'storage', label: 'Storage', title: 'Storage & Cache' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'editor' | 'behavior' | 'advanced' | 'storage')}
              className={`flex-1 px-3 py-2 text-xs transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-[#007acc] text-[#cccccc] bg-[#2a2d2e]'
                  : 'border-transparent text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
              title={tab.title}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="p-4">
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Theme
                </label>
                <select
                  value={localSettings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value as 'vs-dark' | 'light')}
                  className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-[#cccccc] text-sm focus:outline-none focus:border-[#007acc]"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Font Size: {localSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={localSettings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Tab Size */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Tab Size
                </label>
                <select
                  value={localSettings.tabSize}
                  onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-[#cccccc] text-sm focus:outline-none focus:border-[#007acc]"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Line Numbers
                </label>
                <button
                  onClick={() => handleSettingChange('lineNumbers', localSettings.lineNumbers === 'on' ? 'off' : 'on')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.lineNumbers === 'on'
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.lineNumbers === 'on' ? 'On' : 'Off'}
                </button>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Word Wrap
                </label>
                <button
                  onClick={() => handleSettingChange('wordWrap', localSettings.wordWrap === 'on' ? 'off' : 'on')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.wordWrap === 'on'
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.wordWrap === 'on' ? 'On' : 'Off'}
                </button>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Minimap
                </label>
                <button
                  onClick={() => handleSettingChange('minimap', !localSettings.minimap)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.minimap
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.minimap ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-4">
              {/* Format on Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Format on Save
                </label>
                <button
                  onClick={() => handleSettingChange('formatOnSave', !localSettings.formatOnSave)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.formatOnSave
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.formatOnSave ? 'On' : 'Off'}
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Auto Save
                </label>
                <button
                  onClick={() => handleSettingChange('autoSave', !localSettings.autoSave)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.autoSave
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.autoSave ? 'On' : 'Off'}
                </button>
              </div>

              {/* Default Layout */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Default Layout
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSettingChange('defaultLayout', 'editor')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      localSettings.defaultLayout === 'editor'
                        ? 'bg-[#007acc] text-white'
                        : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                    }`}
                    title="Editor Only"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
                      <rect x="11" y="3" width="10" height="18" fill="currentColor" opacity="0.3"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSettingChange('defaultLayout', 'split')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      localSettings.defaultLayout === 'split'
                        ? 'bg-[#007acc] text-white'
                        : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                    }`}
                    title="Split View"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
                      <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleSettingChange('defaultLayout', 'preview')}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      localSettings.defaultLayout === 'preview'
                        ? 'bg-[#007acc] text-white'
                        : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                    }`}
                    title="Preview Only"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="8" height="18" fill="currentColor" opacity="0.3"/>
                      <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Console Clear */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Auto-clear Console
                </label>
                <button
                  onClick={() => handleSettingChange('consoleClear', !localSettings.consoleClear)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.consoleClear
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.consoleClear ? 'On' : 'Off'}
                </button>
              </div>

              {/* Error Highlight */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Error Highlighting
                </label>
                <button
                  onClick={() => handleSettingChange('errorHighlight', !localSettings.errorHighlight)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.errorHighlight
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.errorHighlight ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              {/* Strict Mode */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  TypeScript Strict Mode
                </label>
                <button
                  onClick={() => handleSettingChange('strictMode', !localSettings.strictMode)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.strictMode
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.strictMode ? 'On' : 'Off'}
                </button>
              </div>

              {/* Import Suggestions */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Import Suggestions
                </label>
                <button
                  onClick={() => handleSettingChange('importSuggestions', !localSettings.importSuggestions)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.importSuggestions
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.importSuggestions ? 'On' : 'Off'}
                </button>
              </div>

              {/* Hot Reload */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#cccccc]">
                  Hot Reload
                </label>
                <button
                  onClick={() => handleSettingChange('hotReload', !localSettings.hotReload)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    localSettings.hotReload
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                  }`}
                >
                  {localSettings.hotReload ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              {/* Clear Cache */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Cache Management
                </label>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full px-3 py-2 bg-[#d73a49] hover:bg-[#cb2431] text-white rounded transition-colors text-sm"
                >
                  Clear All Cache & Reload
                </button>
              </div>

              {/* Export Settings */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Export Settings
                </label>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(localSettings, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'jstcode-settings.json';
                    a.click();
                  }}
                  className="w-full px-3 py-2 bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] rounded transition-colors text-sm"
                >
                  Download Settings JSON
                </button>
              </div>

              {/* Reset */}
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  Reset to Defaults
                </label>
                <button
                  onClick={resetToDefaults}
                  className="w-full px-3 py-2 bg-[#f85149] hover:bg-[#da3633] text-white rounded transition-colors text-sm"
                >
                  Reset All Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function useEditorSettings() {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('jstcode-editor-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all new properties exist
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
        // If parsing fails, use defaults
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSettings = (newSettings: EditorSettings) => {
    setSettings(newSettings);
    localStorage.setItem('jstcode-editor-settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}