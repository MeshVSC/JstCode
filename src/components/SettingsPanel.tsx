'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeType } from '@/types/theme';

export interface EditorSettings {
  // Appearance
  appTheme: ThemeType;
  
  // Editor
  editorTheme: 'vs-dark' | 'light';
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
  // Appearance
  appTheme: 'professional-dark',
  
  // Editor
  editorTheme: 'vs-dark',
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
  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'storage'>('editor');
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(currentTheme);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

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

  const handleThemeSelect = (themeId: ThemeType) => {
    setSelectedTheme(themeId);
  };

  const handleThemeApply = () => {
    setTheme(selectedTheme);
    handleSettingChange('appTheme', selectedTheme);
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 panel w-96 max-h-[80vh] overflow-auto shadow-xl">
        {/* Header */}
        <div className="panel-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{borderColor: 'var(--surface-border)'}}>
          {[
            { key: 'editor', label: 'Editor', title: 'Editor & Development Settings' },
            { key: 'storage', label: 'Storage', title: 'Storage & Cache' },
            { key: 'appearance', label: 'Appearance', title: 'Theme & Visual Settings' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'appearance' | 'editor' | 'storage')}
              className={`flex-1 px-3 py-2 text-xs transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary bg-hover'
                  : 'border-transparent text-muted hover:text-primary hover:bg-hover'
              }`}
              style={{
                borderBottomColor: activeTab === tab.key ? 'var(--primary)' : 'transparent'
              }}
              title={tab.title}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="p-4">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* App Theme */}
              <div>
                <label className="block text-sm font-medium text-primary mb-3">
                  App Theme
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`
                        p-4 rounded-lg cursor-pointer transition-all border-2
                        ${selectedTheme === theme.id 
                          ? 'border-primary bg-hover shadow-md' 
                          : 'border-transparent bg-elevated hover:bg-hover hover:shadow-sm'
                        }
                      `}
                      onClick={() => handleThemeSelect(theme.id)}
                      style={{
                        borderColor: selectedTheme === theme.id ? 'var(--primary)' : 'var(--surface-border)',
                        background: currentTheme === theme.id ? 'var(--surface-hover)' : 'var(--surface-elevated)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">{theme.name}</h3>
                        {selectedTheme === theme.id && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                            style={{background: 'var(--primary)'}}
                          >
                            ✓
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-secondary mb-3">{theme.description}</p>
                      
                      {/* Theme Preview */}
                      <div 
                        className="h-12 rounded-md flex overflow-hidden"
                        style={{background: theme.colors.surfaceBg}}
                      >
                        <div 
                          className="flex-1 flex items-center px-2"
                          style={{background: theme.colors.surfaceSidebar}}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2"
                            style={{background: theme.colors.primary}}
                          ></div>
                          <div className="text-xs" style={{color: theme.colors.textSecondary}}>
                            Files
                          </div>
                        </div>
                        <div 
                          className="flex-2 flex items-center px-2"
                          style={{background: theme.colors.surfaceElevated}}
                        >
                          <div className="text-xs" style={{color: theme.colors.textPrimary}}>
                            Editor
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Apply Theme Button */}
                {selectedTheme !== currentTheme && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleThemeApply}
                      className="btn btn-primary btn-sm"
                    >
                      Apply Theme
                    </button>
                    <button
                      onClick={() => setSelectedTheme(currentTheme)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4">

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
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
                <label className="block text-sm font-medium text-primary mb-2">
                  Tab Size
                </label>
                <select
                  value={localSettings.tabSize}
                  onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
                  className="input"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Line Numbers
                </label>
                <button
                  onClick={() => handleSettingChange('lineNumbers', localSettings.lineNumbers === 'on' ? 'off' : 'on')}
                  className={`btn btn-sm ${
                    localSettings.lineNumbers === 'on' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.lineNumbers === 'on' ? 'On' : 'Off'}
                </button>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Word Wrap
                </label>
                <button
                  onClick={() => handleSettingChange('wordWrap', localSettings.wordWrap === 'on' ? 'off' : 'on')}
                  className={`btn btn-sm ${
                    localSettings.wordWrap === 'on' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.wordWrap === 'on' ? 'On' : 'Off'}
                </button>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Minimap
                </label>
                <button
                  onClick={() => handleSettingChange('minimap', !localSettings.minimap)}
                  className={`btn btn-sm ${
                    localSettings.minimap ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.minimap ? 'On' : 'Off'}
                </button>
              </div>

              {/* Format on Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Format on Save
                </label>
                <button
                  onClick={() => handleSettingChange('formatOnSave', !localSettings.formatOnSave)}
                  className={`btn btn-sm ${
                    localSettings.formatOnSave ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.formatOnSave ? 'On' : 'Off'}
                </button>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Auto Save
                </label>
                <button
                  onClick={() => handleSettingChange('autoSave', !localSettings.autoSave)}
                  className={`btn btn-sm ${
                    localSettings.autoSave ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.autoSave ? 'On' : 'Off'}
                </button>
              </div>

              {/* Default Layout */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Default Layout
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSettingChange('defaultLayout', 'editor')}
                    className={`btn btn-sm ${
                      localSettings.defaultLayout === 'editor' ? 'btn-primary' : 'btn-secondary'
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
                    className={`btn btn-sm ${
                      localSettings.defaultLayout === 'split' ? 'btn-primary' : 'btn-secondary'
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
                    className={`btn btn-sm ${
                      localSettings.defaultLayout === 'preview' ? 'btn-primary' : 'btn-secondary'
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
                <label className="text-sm font-medium text-primary">
                  Auto-clear Console
                </label>
                <button
                  onClick={() => handleSettingChange('consoleClear', !localSettings.consoleClear)}
                  className={`btn btn-sm ${
                    localSettings.consoleClear ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.consoleClear ? 'On' : 'Off'}
                </button>
              </div>

              {/* Error Highlight */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Error Highlighting
                </label>
                <button
                  onClick={() => handleSettingChange('errorHighlight', !localSettings.errorHighlight)}
                  className={`btn btn-sm ${
                    localSettings.errorHighlight ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.errorHighlight ? 'On' : 'Off'}
                </button>
              </div>

              {/* Strict Mode */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  TypeScript Strict Mode
                </label>
                <button
                  onClick={() => handleSettingChange('strictMode', !localSettings.strictMode)}
                  className={`btn btn-sm ${
                    localSettings.strictMode ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.strictMode ? 'On' : 'Off'}
                </button>
              </div>

              {/* Import Suggestions */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Import Suggestions
                </label>
                <button
                  onClick={() => handleSettingChange('importSuggestions', !localSettings.importSuggestions)}
                  className={`btn btn-sm ${
                    localSettings.importSuggestions ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {localSettings.importSuggestions ? 'On' : 'Off'}
                </button>
              </div>

              {/* Hot Reload */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-primary">
                  Hot Reload
                </label>
                <button
                  onClick={() => handleSettingChange('hotReload', !localSettings.hotReload)}
                  className={`btn btn-sm ${
                    localSettings.hotReload ? 'btn-primary' : 'btn-secondary'
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
                <label className="block text-sm font-medium text-primary mb-2">
                  Cache Management
                </label>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="btn btn-sm w-full bg-error text-on-accent hover:bg-error/80"
                >
                  Clear All Cache & Reload
                </button>
              </div>

              {/* Export Settings */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
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
                  className="btn btn-secondary btn-sm w-full"
                >
                  Download Settings JSON
                </button>
              </div>

              {/* Reset */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Reset to Defaults
                </label>
                <button
                  onClick={resetToDefaults}
                  className="btn btn-sm w-full bg-error text-on-accent hover:bg-error/80"
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