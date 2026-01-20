import React, { useState } from 'react';
import { useEdgeSearch } from '../hooks/useEdgeSearch';
import { useEdgeLLM } from '../hooks/useEdgeLLM';

export default function TestSearchPage() {
    const { search, isReady: searchReady, status: searchStatus } = useEdgeSearch();
    const { init: initLLM, isReady: llmReady, status: llmStatus, progress, askRecipe, response } = useEdgeLLM();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [activeRecipe, setActiveRecipe] = useState(null);

    const handleSearch = async () => {
        if (!query || !searchReady) return;

        setSearching(true);
        // This runs completely offline
        const hits = await search(query);
        setResults(hits);
        setSearching(false);
    };

    const handleAnalyze = (recipe) => {
        setActiveRecipe(recipe);
        // Example Prompt: Check generic health info
        askRecipe(recipe, "Is this recipe healthy? What are the key nutritional benefits based on ingredients?");
    };

    if (!searchReady) {
        return (
            <div className="p-10 text-center" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 className="text-xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Initializing Edge AI...</h2>
                <p className="text-gray-500" style={{ color: '#6b7280' }}>{searchStatus}</p>
                <div style={{ marginTop: '1rem', width: '200px', height: '10px', backgroundColor: '#e5e7eb', borderRadius: '5px', margin: '1rem auto' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '5px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4" style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
            {/* Header / Search Bar */}
            <div className="flex gap-2 mb-6" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What do you want to cook? (e.g. 'Gluten free muffins')"
                    className="flex-1 p-2 border rounded"
                    style={{ flex: 1, padding: '0.5rem', borderWidth: '1px', borderRadius: '0.25rem' }}
                />
                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                    style={{ backgroundColor: '#2563eb', color: 'white', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '0.25rem', cursor: searching ? 'not-allowed' : 'pointer' }}
                >
                    {searching ? "Thinking..." : "Search"}
                </button>
            </div>

            {/* AI Loader Control */}
            {!llmReady && (
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-6" style={{ backgroundColor: '#fefce8', padding: '1rem', borderRadius: '0.25rem', borderWidth: '1px', borderColor: '#fef08a', marginBottom: '1.5rem' }}>
                    <p className="font-bold" style={{ fontWeight: 'bold' }}>✨ Enable Generative AI?</p>
                    <p className="text-sm mb-2" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>This will download the Phi-3 model (~2GB) to your browser cache.</p>
                    <button onClick={initLLM} className="bg-yellow-600 text-white px-4 py-2 rounded" style={{ backgroundColor: '#ca8a04', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
                        Activate AI Chef
                    </button>
                    {progress > 0 && <div className="mt-2 text-xs" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Loading: {progress}% ({llmStatus})</div>}
                </div>
            )}

            {/* The RAG Display Area */}
            {llmReady && activeRecipe && (
                <div className="fixed bottom-0 right-0 w-96 bg-white shadow-2xl border-t border-l p-4 h-96 overflow-auto" style={{ position: 'fixed', bottom: 0, right: 0, width: '24rem', height: '24rem', backgroundColor: 'white', borderTopWidth: '1px', borderLeftWidth: '1px', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'auto', zIndex: 50 }}>
                    <h3 className="font-bold border-b pb-2" style={{ fontWeight: 'bold', borderBottomWidth: '1px', paddingBottom: '0.5rem' }}>AI Chef on: {activeRecipe.t}</h3>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap" style={{ marginTop: '0.5rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
                        {response || <span className="animate-pulse">Thinking...</span>}
                    </p>
                </div>
            )}

            {/* Results List */}
            <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results.map((recipe, index) => (
                    <div key={index} className="border p-4 rounded shadow-sm hover:shadow-md transition flex justify-between" style={{ borderWidth: '1px', padding: '1rem', borderRadius: '0.25rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                            <h3 className="font-bold text-lg text-blue-800" style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e40af' }}>{recipe.t}</h3>
                            <p className="text-sm text-gray-600" style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                {/* Show first few ingredients */}
                                {recipe.ing ? recipe.ing.slice(0, 5).join(", ") : 'No ingredients listed'}...
                            </p>
                            <div className="text-xs text-gray-400 mt-1" style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                Match Score: {(recipe.score * 100).toFixed(1)}%
                            </div>
                        </div>
                        {llmReady && (
                            <button
                                onClick={() => handleAnalyze(recipe)}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm h-fit"
                                style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', height: 'fit-content', marginLeft: '1rem', flexShrink: 0 }}
                            >
                                Analyze
                            </button>
                        )}
                    </div>
                ))}
                {results.length === 0 && !searching && query && (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>No results found.</div>
                )}
            </div>
        </div>
    );
}
