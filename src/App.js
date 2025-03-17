import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState(""); // User input text
  const [selectedEntities, setSelectedEntities] = useState([]); // Manually highlighted entities
  const [llmEntities, setLlmEntities] = useState([]); // LLM-extracted entities (modifiable)
  const [comparisonResult, setComparisonResult] = useState(null); // Comparison results
  const [loading, setLoading] = useState({ submit: false, extract: false, compare: false }); // Individual button states

  const userId = "test-user";

  // ✅ Handle text selection to highlight entities
  const handleHighlight = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText && !selectedEntities.some(entity => entity.name === selectedText)) {
      const entityUrl = prompt(`Enter the URL for ${selectedText} (or leave blank):`);
      setSelectedEntities(prev => [...prev, { name: selectedText, url: entityUrl || "" }]);
    }
  };

  // ✅ Remove a manually highlighted entity
  const removeHighlightedEntity = async (name) => {
    try {
      setSelectedEntities(prev => prev.filter(entity => entity.name !== name));
      await axios.delete(`http://localhost:9090/rastame/api/metadataenricher/manual-highlight`, {
        params: { userId, entityName: name }
      });
    } catch (error) {
      console.error("❌ Error deleting entity:", error);
    }
  };

  // ✅ Submit manually highlighted entities
  const submitHighlightedEntities = async () => {
    try {
      setLoading(prev => ({ ...prev, submit: true }));
      await axios.post(`http://localhost:9090/rastame/api/metadataenricher/manual-highlight`, selectedEntities, {
        params: { userId }
      });
      alert("✅ Entities submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting entities:", error);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  // ✅ Extract LLM-detected entities
  const extractLlmEntities = async () => {
    try {
      setLoading(prev => ({ ...prev, extract: true }));
      const response = await axios.post(`http://localhost:9090/rastame/api/metadataenricher/description`, text, {
        headers: { "Content-Type": "application/json" }
      });
      setLlmEntities(response.data);
    } catch (error) {
      console.error("❌ Error extracting LLM entities:", error);
    } finally {
      setLoading(prev => ({ ...prev, extract: false }));
    }
  };

  // ✅ Remove an LLM-extracted entity
  const removeLlmEntity = (name) => {
    setLlmEntities(prev => prev.filter(entity => entity.name !== name));
  };

  // ✅ Add missing LLM-extracted entity
  const addLlmEntity = () => {
    const newEntityName = prompt("Enter missing entity name:");
    const entityUrl = prompt(`Enter a URL for ${newEntityName} (or leave blank):`);
    if (newEntityName) {
      setLlmEntities(prev => [...prev, { name: newEntityName, category: "Unknown", url: entityUrl || "" }]);
    }
  };

  // ✅ Submit modified LLM-extracted entities
  const submitModifiedLlmEntities = async () => {
    try {
      await axios.post(`http://localhost:9090/rastame/api/metadataenricher/modify-llm-entities`, llmEntities, {
        params: { userId }
      });
      alert("✅ LLM entities updated successfully!");
    } catch (error) {
      console.error("❌ Error updating LLM entities:", error);
    }
  };

  // ✅ Compare user-highlighted and LLM-extracted entities
  const compareEntities = async () => {
    try {
      setLoading(prev => ({ ...prev, compare: true }));
      const response = await axios.post(
        "http://localhost:9090/rastame/api/metadataenricher/compare-entities",
        {
          userEntities: selectedEntities.map(entity => entity.name),
          llmEntities: llmEntities.map(entity => entity.name),
        }
      );
      setComparisonResult(response.data);
    } catch (error) {
      console.error("❌ Error comparing entities:", error);
    } finally {
      setLoading(prev => ({ ...prev, compare: false }));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>🚀 Entity Linking Review Tool</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onMouseUp={handleHighlight}
        rows="5"
        cols="50"
        placeholder="Enter POI Description..."
      />

      {/* Highlighted Entities */}
      <div>
        <h3>Highlighted Entities (Manual Selection):</h3>
        {selectedEntities.length > 0 ? (
          <ul>
            {selectedEntities.map((entity, index) => (
              <li key={index}>
                {entity.name} <a href={entity.url} target="_blank" rel="noopener noreferrer">{entity.url ? "(Info)" : ""}</a>
                <button onClick={() => removeHighlightedEntity(entity.name)}>❌</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No highlighted entities.</p>
        )}
      </div>

      {/* Buttons */}
      <button onClick={submitHighlightedEntities} disabled={loading.submit}>Submit Manual Entities</button>
      <button onClick={extractLlmEntities} disabled={loading.extract}>Extract Entities (LLM)</button>
      <button onClick={compareEntities} disabled={loading.compare}>Compare Results</button>

      {/* LLM-Extracted Entities */}
      {llmEntities.length > 0 && (
        <div>
          <h3>🧠 LLM-Extracted Entities:</h3>
          <ul>
            {llmEntities.map((entity, index) => (
              <li key={index}>
                <strong>{entity.name}</strong> - {entity.category} 
                <a href={entity.url} target="_blank" rel="noopener noreferrer"> (Info)</a>
                <button onClick={() => removeLlmEntity(entity.name)}>❌</button>
              </li>
            ))}
          </ul>
          <button onClick={addLlmEntity}>➕ Add Missing Entity</button>
          <button onClick={submitModifiedLlmEntities}>✅ Save LLM Modifications</button>
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <div>
          <h3>📊 Comparison Results:</h3>
          <p>✅ True Positives: {comparisonResult.truePositives}</p>
          <p>❌ False Positives: {comparisonResult.falsePositives}</p>
          <p>🚫 False Negatives: {comparisonResult.falseNegatives}</p>
          <p>📈 Precision: {comparisonResult.precision.toFixed(2)}</p>
          <p>📊 Recall: {comparisonResult.recall.toFixed(2)}</p>
          <p>⚡ F1-Score: {comparisonResult.f1Score.toFixed(2)}</p>
          <p>🏆 PageRank Score: {comparisonResult.pageRankScore.toFixed(2)}</p>
          <p>📌 User Entity Density: {comparisonResult.userEntityDensity.toFixed(2)}</p>
          <p>🧠 LLM Entity Density: {comparisonResult.llmEntityDensity.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
