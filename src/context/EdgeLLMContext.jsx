import React, { createContext, useContext, useState, useRef } from 'react';
import * as webllm from "@mlc-ai/web-llm";
// Import the worker script using Vite's syntax
import WorkerScript from '../workers/llm.worker?worker';

const EdgeLLMContext = createContext();

const SELECTED_MODEL = "Phi-3.5-mini-instruct-q4f16_1-MLC";

export function EdgeLLMProvider({ children }) {
    const [status, setStatus] = useState("Idle");
    const [progress, setProgress] = useState(0); // 0 to 100
    const [isReady, setIsReady] = useState(false);
    const [response, setResponse] = useState("");

    const engineRef = useRef(null);

    // Initialize the engine (Worker Mode)
    const init = async () => {
        if (engineRef.current) return;

        try {
            setStatus("Booting Background Worker...");
            // Custom handler to update progress bar in UI
            const initProgressCallback = (report) => {
                const p = report.progress || 0;
                setProgress(Math.round(p * 100));
                setStatus(report.text);
            };

            // 1. Spawn Worker
            const worker = new WorkerScript();

            // 2. Connect Engine to Worker
            const engine = await webllm.CreateWebWorkerMLCEngine(
                worker,
                SELECTED_MODEL,
                { initProgressCallback: initProgressCallback }
            );

            engineRef.current = engine;
            setIsReady(true);
            setStatus("Ready (Worker Mode)");
            setProgress(100);
        } catch (err) {
            console.error("WebLLM Worker Error:", err);
            setStatus("Error: Worker failed to start.");
        }
    };

    // The "RAG" / Chat Function
    const askRecipe = async (recipe, promptText) => {
        if (!engineRef.current) return;
        setResponse(""); // Clear previous
        setStatus("Generating...");

        const messages = [
            { role: "user", content: promptText }
        ];

        try {
            const chunks = await engineRef.current.chat.completions.create({
                messages,
                stream: true,
                // max_tokens: 1024, // Allow enough tokens for the JSON response
            });

            let fullText = "";
            for await (const chunk of chunks) {
                const delta = chunk.choices[0]?.delta?.content || "";
                fullText += delta;
                setResponse(fullText); // Update UI in real-time
            }
            setStatus("Ready");
            return fullText; // Return final text for convenience
        } catch (err) {
            console.error("Geneartion Error:", err);
            setStatus("Error generating response.");
            return null;
        }
    };

    // Stop Generation Function
    const stopGeneration = async () => {
        if (engineRef.current) {
            try {
                await engineRef.current.interruptGenerate();
                setStatus("Stopped");
            } catch (err) {
                console.error("Failed to stop generation:", err);
            }
        }
    };

    const value = {
        init,
        isReady,
        status,
        progress,
        askRecipe,
        response,
        stopGeneration
    };

    return (
        <EdgeLLMContext.Provider value={value}>
            {children}
        </EdgeLLMContext.Provider>
    );
}

export function useEdgeLLMContext() {
    return useContext(EdgeLLMContext);
}
