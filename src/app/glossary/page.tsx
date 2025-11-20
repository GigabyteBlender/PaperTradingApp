'use client';

import { useState, useMemo } from 'react';
import { glossaryTerms, type GlossaryTerm } from '@/lib/glossary';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort terms alphabetically
  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Return all terms sorted alphabetically
      return [...glossaryTerms].sort((a, b) => 
        a.term.localeCompare(b.term)
      );
    }

    // Filter terms that match search query
    return glossaryTerms
      .filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query)
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery]);

  // Get category display name
  const getCategoryName = (category: GlossaryTerm['category']) => {
    const names = {
      price: 'Price',
      volume: 'Volume',
      fundamental: 'Fundamental',
      technical: 'Technical',
      market: 'Market',
    };
    return names[category];
  };

  // Get category color
  const getCategoryColor = (category: GlossaryTerm['category']) => {
    const colors = {
      price: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      volume: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      fundamental: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      market: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Financial Glossary
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Learn the meaning of financial terms used throughout the application
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            aria-label="Search glossary terms"
          />
        </div>

        {/* Results */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No results found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-2">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <div
                key={term.term}
                className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {term.term}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                      term.category
                    )}`}
                  >
                    {getCategoryName(term.category)}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {searchQuery && filteredTerms.length > 0 && (
          <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
          </div>
        )}
      </div>
    </div>
  );
}
