'use client';

import { useState, useCallback } from 'react';

export interface Package {
  name: string;
  version: string;
  description: string;
  imports: string[];
  url: string;
  category: 'ui' | 'utility' | 'animation' | 'data' | 'styling' | 'other';
}

const POPULAR_PACKAGES: Package[] = [
  {
    name: 'lucide-react',
    version: 'latest',
    description: 'Beautiful & consistent icon library',
    imports: ['import { Heart, Star, Download } from "lucide-react"'],
    url: 'https://esm.sh/lucide-react',
    category: 'ui'
  },
  {
    name: 'framer-motion',
    version: 'latest', 
    description: 'Motion library for React',
    imports: ['import { motion, AnimatePresence } from "framer-motion"'],
    url: 'https://esm.sh/framer-motion',
    category: 'animation'
  },
  {
    name: 'date-fns',
    version: 'latest',
    description: 'Modern JavaScript date utility library',
    imports: ['import { format, addDays } from "date-fns"'],
    url: 'https://esm.sh/date-fns',
    category: 'utility'
  },
  {
    name: 'lodash-es',
    version: 'latest',
    description: 'Modular utilities for JavaScript',
    imports: ['import { debounce, throttle } from "lodash-es"'],
    url: 'https://esm.sh/lodash-es',
    category: 'utility'
  },
  {
    name: 'zustand',
    version: 'latest',
    description: 'Small, fast state management',
    imports: ['import { create } from "zustand"'],
    url: 'https://esm.sh/zustand',
    category: 'data'
  },
  {
    name: 'clsx',
    version: 'latest',
    description: 'Utility for constructing className strings',
    imports: ['import clsx from "clsx"'],
    url: 'https://esm.sh/clsx',
    category: 'styling'
  }
];

interface PackageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPackage: (pkg: Package) => void;
}

export default function PackageManager({ isOpen, onClose, onAddPackage }: PackageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<Package[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { id: 'all', label: 'All Packages' },
    { id: 'ui', label: 'UI Components' },
    { id: 'utility', label: 'Utilities' },
    { id: 'animation', label: 'Animation' },
    { id: 'data', label: 'Data & State' },
    { id: 'styling', label: 'Styling' },
  ];

  const filteredPackages = POPULAR_PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPackage = useCallback((pkg: Package) => {
    onAddPackage(pkg);
    onClose();
  }, [onAddPackage, onClose]);

  const searchNPM = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search NPM registry via skypack
      const response = await fetch(`https://api.skypack.dev/v1/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      const packages: Package[] = data.results?.slice(0, 10).map((result: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        name: result.name,
        version: 'latest',
        description: result.description || 'No description available',
        imports: [`import ${result.name.includes('-') ? `* as ${result.name.replace(/-/g, '')}` : result.name} from "${result.name}"`],
        url: `https://esm.sh/${result.name}`,
        category: 'other' as const
      })) || [];
      
      setSearchResults(packages);
    } catch (error) {
      console.error('Failed to search packages:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchNPM(query);
    } else {
      setSearchResults([]);
    }
  }, [searchNPM]);

  if (!isOpen) return null;

  const displayPackages = searchQuery.length > 2 ? searchResults : filteredPackages;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Package Manager Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#2d2d30] border border-[#3e3e42] rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-lg font-semibold text-[#cccccc]">📦 Add Package</h2>
          <button
            onClick={onClose}
            className="text-[#858585] hover:text-[#cccccc] text-xl"
          >
            ×
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#3e3e42]">
          <div className="relative mb-3">
            <input
              id="package-search"
              name="package-search"
              type="text"
              placeholder="Search packages... (e.g., 'react-router', 'axios')"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-[#cccccc] text-sm focus:outline-none focus:border-[#007acc]"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#007acc] border-t-transparent"></div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-xs rounded whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#3e3e42] text-[#cccccc] hover:bg-[#4e4e52]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Package List */}
        <div className="flex-1 overflow-auto p-4">
          {displayPackages.length === 0 ? (
            <div className="text-center text-[#858585] py-8">
              {searchQuery.length > 2 ? 'No packages found' : 'Start typing to search NPM packages'}
            </div>
          ) : (
            <div className="space-y-2">
              {displayPackages.map((pkg, index) => (
                <div
                  key={`${pkg.name}-${index}`}
                  className="p-3 bg-[#252526] border border-[#3e3e42] rounded hover:bg-[#2a2d2e] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-[#cccccc]">{pkg.name}</h3>
                        <span className="text-xs text-[#858585] bg-[#3e3e42] px-2 py-0.5 rounded">
                          {pkg.version}
                        </span>
                        <span className="text-xs text-[#007acc] bg-[#007acc20] px-2 py-0.5 rounded">
                          {pkg.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#858585] mb-2">{pkg.description}</p>
                      <div className="text-xs text-[#858585] font-mono bg-[#1e1e1e] p-2 rounded">
                        {pkg.imports[0]}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPackage(pkg)}
                      className="ml-3 px-3 py-1 bg-[#007acc] hover:bg-[#0086d3] text-white text-sm rounded transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3e3e42] text-xs text-[#858585]">
          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Packages are loaded via ESM CDN - no build step required!
        </div>
      </div>
    </>
  );
}