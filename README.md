# React Frontend for POI Entity Review

This is the frontend application for the POI Entity Review system, built using **React.js**.

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** (or `yarn` as an alternative)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/sadia-lab/react-frontend.git
   cd entity-review1
2. Install dependencies:
npm install
3: Start the development server:
npm start
4: Open the app in your browser:
http://localhost:3000
📁 Project Structure
csharp
Copy
Edit
entity-review1/
│── src/                # Source code
│   ├── components/     # UI components
│   ├── pages/          # Page-level components
│   ├── services/       # API service calls
│   ├── assets/         # Static assets (images, icons)
│   ├── App.js          # Main application component
│   ├── index.js        # Entry point
│── public/             # Static public files
│── package.json        # Project dependencies & scripts
│── README.md           # Documentation
🛠 Available Scripts
npm start – Runs the app in development mode
npm test – Launches the test runner
npm run build – Builds the app for production
npm run eject – Removes React configuration (irreversible)
🌍 API Integration
This React app interacts with the Spring AI Backend running at:
http://localhost:9090/api/metadataenricher
Ensure the backend is running before testing API calls.
