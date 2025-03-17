import React, { useState } from "react";
import axios from "axios";

export default function EntityReviewTool() {
    const [poiDescription, setPoiDescription] = useState("The Colosseum, also known as the Flavian Amphitheater, is an iconic ancient Roman structure located in the heart of Rome, Italy. Built in 70-80 AD under Emperor Vespasian, this massive amphitheater was used for gladiatorial contests, public spectacles, and dramas based on classical mythology. With a seating capacity of up to 50,000 spectators, it was one of the most advanced architectural achievements of its time. Today, the Colosseum stands as a UNESCO World Heritage Site and attracts millions of tourists annually.");
    
    const [manualEntities, setManualEntities] = useState([]);
    const [aiEntities, setAiEntities] = useState([]);
    const [comparisonResult, setComparisonResult] = useState(null);
    const userId = "test-user"; // Dummy user ID for API calls

    // ✅ Capture Text Highlighting
    const handleHighlight = () => {
        const selection = window.getSelection().toString().trim();
        if (selection && !manualEntities.includes(selection)) {
            setManualEntities([...manualEntities, selection]);
        }
    };

    // ✅ Remove Highlighted Entity
    const removeEntity = (entity) => {
        setManualEntities(manualEntities.filter(e => e !== entity));
    };

    // ✅ Submit Manually Highlighted Entities
    const submitManualEntities = async () => {
        try {
            await axios.post(`http://localhost:9090/rastame/api/metadataenricher/manual-highlight?userId=${userId}`, {
                highlightedEntities: manualEntities
            });
            alert("Manual entities submitted successfully!");
        } catch (error) {
            console.error("Error submitting manual entities:", error);
        }
    };

    // ✅ Extract Entities Using AI
    const extractEntitiesAI = async () => {
        try {
            const response = await axios.post(`http://localhost:9090/rastame/api/metadataenricher/description`, 
                poiDescription, 
                { headers: { "Content-Type": "application/json" } }
            );
            setAiEntities(response.data.entities || []);
        } catch (error) {
            console.error("Error extracting AI entities:", error);
        }
    };

    // ✅ Compare Manual vs AI Entities
    const compareEntities = async () => {
        try {
            const response = await axios.post(`http://localhost:9090/rastame/api/metadataenricher/compare-entities`, {
                userEntities: manualEntities,
                llmEntities: aiEntities.map(entity => entity.name)
            });
            setComparisonResult(response.data);
        } catch (error) {
            console.error("Error comparing entities:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>Entity Linking Review Tool</h2>

            {/* ✅ Input POI Description */}
            <label>Enter POI Description:</label>
            <textarea
                value={poiDescription}
                onChange={(e) => setPoiDescription(e.target.value)}
                onMouseUp={handleHighlight}
                placeholder="Highlight text to mark entities..."
                rows="4"
                style={{ width: "100%", padding: "10px", marginBottom: "10px", fontSize: "16px" }}
            />

            {/* ✅ Highlighted Entities Section */}
            <h4>Highlighted Entities (Manual Selection):</h4>
            <ul>
                {manualEntities.map((entity, index) => (
                    <li key={index} style={{ cursor: "pointer", color: "red" }} onClick={() => removeEntity(entity)}>
                        {entity} ❌
                    </li>
                ))}
            </ul>

            {/* ✅ Buttons */}
            <button onClick={submitManualEntities}>Submit Manual Entities</button>
<button onClick={extractEntitiesAI}>Extract Entities (AI)</button>
<button onClick={compareEntities}>Compare Results</button>


            {/* ✅ Display AI Extracted Entities */}
            {aiEntities.length > 0 && (
                <div>
                    <h4>AI Extracted Entities:</h4>
                    <ul>
                        {aiEntities.map((entity, index) => (
                            <li key={index}>{entity.name} ({entity.category}) - <a href={entity.url} target="_blank" rel="noopener noreferrer">Link</a></li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ✅ Display Comparison Metrics */}
            {comparisonResult && (
                <div style={{ marginTop: "20px" }}>
                    <h4>Comparison Metrics:</h4>
                    <p>✅ <strong>True Positives:</strong> {comparisonResult.truePositives}</p>
                    <p>❌ <strong>False Positives:</strong> {comparisonResult.falsePositives}</p>
                    <p>⚠️ <strong>False Negatives:</strong> {comparisonResult.falseNegatives}</p>
                    <p>📏 <strong>Precision:</strong> {comparisonResult.precision.toFixed(2)}</p>
                    <p>📢 <strong>Recall:</strong> {comparisonResult.recall.toFixed(2)}</p>
                    <p>🔍 <strong>F1 Score:</strong> {comparisonResult.f1Score.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}

// ✅ Button Styling
const styles = {
    button: {
        margin: "10px 5px",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    }
};
