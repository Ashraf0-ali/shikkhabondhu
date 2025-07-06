
import React from 'react';
import SearchHeader from './search/SearchHeader';
import SearchFilters from './search/SearchFilters';
import SearchBar from './search/SearchBar';
import SearchResults from './search/SearchResults';
import SearchFooter from './search/SearchFooter';
import { useSearch } from './search/useSearch';

const SearchInterface = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    classFilter,
    clearClassFilter
  } = useSearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <SearchHeader />
        
        <SearchFilters 
          classFilter={classFilter}
          onClearClassFilter={clearClassFilter}
        />
        
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          isSearching={isSearching}
          classFilter={classFilter}
        />
        
        <SearchResults
          searchResults={searchResults}
          searchQuery={searchQuery}
          classFilter={classFilter}
          isSearching={isSearching}
        />
        
        <SearchFooter />
      </div>
    </div>
  );
};

export default SearchInterface;
