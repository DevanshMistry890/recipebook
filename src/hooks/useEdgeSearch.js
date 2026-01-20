import { useState, useEffect, useRef } from 'react';
import { pipeline, env } from '@xenova/transformers';

// Skip local model checks to speed up loading
env.allowLocalModels = false;
env.useBrowserCache = true;

export function useEdgeSearch() {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("Initializing...");

    const recipesRef = useRef([]);
    const vectorsRef = useRef(null);
    const embedderRef = useRef(null);

    useEffect(() => {
        async function loadEdgeEngine() {
            try {
                setStatus("Loading AI Model...");
                embedderRef.current = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

                setStatus("Downloading Recipe Database...");
                const jsonRes = await fetch('/data/recipes.json');
                recipesRef.current = await jsonRes.json();

                setStatus("Loading Search Index...");
                const binRes = await fetch('/data/index.bin');
                const buffer = await binRes.arrayBuffer();
                vectorsRef.current = new Float32Array(buffer);

                setIsReady(true);
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load Edge Engine:", err);
                setStatus("Error loading resources.");
                setIsLoading(false);
            }
        }
        loadEdgeEngine();
    }, []);

    const search = async (query, topK = 10) => {
        if (!isReady) return [];

        // 1. Prepare Keywords (Lowercase, split by space)
        // e.g. "Spicy Chicken" -> ["spicy", "chicken"]
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // 2. Embed the User's Query
        const output = await embedderRef.current(query, { pooling: 'mean', normalize: true });
        const queryVec = output.data;

        const scores = [];
        const vectors = vectorsRef.current;
        const dims = 384;
        const recipes = recipesRef.current;

        // 3. The Hybrid Loop
        for (let i = 0; i < recipes.length; i++) {
            // A. Vector Score (Semantic Meaning)
            let vectorScore = 0;
            for (let j = 0; j < dims; j++) {
                vectorScore += queryVec[j] * vectors[i * dims + j];
            }

            // B. Keyword Boost (Exact Match)
            // If the user types "Milk", recipes containing "Milk" get a massive boost.
            let keywordBonus = 0;
            const recipeText = (recipes[i].t + " " + recipes[i].ing.join(" ")).toLowerCase();

            for (const word of keywords) {
                if (recipeText.includes(word)) {
                    keywordBonus += 0.3; // Huge boost for exact matches
                }
            }

            // C. Final Weighted Score
            // Vector score is usually 0.3 - 0.7.
            // Keyword bonus adds 0.3 per word.
            // This ensures "Exact Matches" always win.
            scores.push({ index: i, score: vectorScore + keywordBonus });
        }

        // 4. Sort and Retrieve
        scores.sort((a, b) => b.score - a.score);

        return scores
            .filter(item => item.score > 0.5) // Filter: > 50% match
            .slice(0, topK)
            .map(item => ({
                ...recipes[item.index],
                // Normalize score for display (cap at 99%)
                score: Math.min(item.score, 0.99)
            }));
    };

    return { search, isReady, isLoading, status };
}
