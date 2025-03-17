import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [serverMessage, setServerMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("http://localhost:9090/")
      .then((response) => {
        setServerMessage(response.data);
      })
      .catch((error) => {
        setServerMessage("Failed to connect to backend.");
        console.error("Error fetching server data:", error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚀 React App is Running!</h1>
      <p>Backend Response: {serverMessage}</p>
    </div>
  );
}

export default App;
