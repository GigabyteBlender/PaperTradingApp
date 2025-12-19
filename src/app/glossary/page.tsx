'use client';

import { useState, useMemo } from 'react';
import { glossaryTerms } from '@/lib/glossary';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort terms based on search query
  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // No search query: return all terms sorted alphabetically by term name
      return [...glossaryTerms].sort((a, b) => 
        a.term.localeCompare(b.term)
      );
    }

    // Search query provided: filter terms where the query appears in the
    // term name (case-insensitive), then sort alphabetically
    return glossaryTerms
      .filter((term) => term.term.toLowerCase().includes(query))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Glossary
          </h1>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search terms..."
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
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  {term.term}
                </h3>
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
