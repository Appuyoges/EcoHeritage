# 🌿 EcoHeritage: Sustainable AI Travel Planner

EcoHeritage is a state-of-the-art travel planning platform that leverages a **5-Agent AI Architecture** to create personalized, eco-friendly itineraries for exploring India's rich cultural heritage.

## 🚀 The 5-Agent Architecture

The core of EcoHeritage is a multi-agent system where specialized AI agents collaborate to fulfill complex user intents. Each agent uses specific mathematical and AI models to ensure precision and sustainability.

### 1. 🧠 Personalization Engine
*   **Role**: Analyzes user interests and profiles to recommend the most relevant heritage sites.
*   **Technology**: **BERT (SentenceTransformer)**.
*   **How it works**: It converts user interests and site descriptions into high-dimensional vectors (embeddings). It then calculates the **Cosine Similarity** between these vectors to find the perfect match for the user.

### 2. 🍃 Impact Scorer (Sustainability Agent)
*   **Role**: Evaluates the environmental and social impact of visiting each site.
*   **Technology**: **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)**.
*   **How it works**: This is a multi-criteria decision-making model. It ranks sites based on carbon footprint, crowd density, eco-infrastructure, and conservation status, ensuring your trip is as green as possible.

### 3. 🗺️ Route Optimizer
*   **Role**: Calculates the most efficient travel path to minimize carbon emissions.
*   **Technology**: **Ant Colony Optimization (ACO)**.
*   **How it works**: Inspired by how ants find the shortest path to food, this algorithm iterates through thousands of possible routes to find the one with the lowest total carbon footprint and travel time.

### 4. 🛡️ CrewAI Supervisor
*   **Role**: Acts as an autonomous Quality Assurance layer.
*   **Technology**: **Google Gemini Pro**.
*   **How it works**: This agent reviews the outputs of all other agents. It checks for logical inconsistencies (e.g., ensuring an "Eco-friendly" trip doesn't use high-emission transport) and verifies that the plan meets all user constraints.

### 5. 🤖 Gemini Planner
*   **Role**: Synthesizes raw data into a warm, natural language itinerary.
*   **Technology**: **Google Gemini 1.5 Pro**.
*   **How it works**: It takes the optimized JSON data and transforms it into a beautiful, human-readable narrative, adding context and "local flavor" to the final response.

---

## ✨ Key Features

*   **Real-Time Data Stream**: Watch the "thoughts" and raw data flow between agents in real-time.
*   **Carbon Analysis**: Detailed breakdown of CO2 emissions saved compared to standard travel.
*   **Localized Content**: Over 40+ Indian UNESCO World Heritage sites with real imagery and localized data.
*   **Eco-Preference Tiers**: Choose between "Eco-First", "Balanced", or "Comfort" to tailor the AI's decision-making.

---

## 🛠️ Technical Stack

*   **Frontend**: React, Framer Motion (for animations), Lucide React (icons).
*   **Backend**: FastAPI (Python), Uvicorn.
*   **AI/ML**: LangChain, Google Generative AI (Gemini), Sentence-Transformers, Scikit-Learn, NumPy.

---

## 🏃 How to Run

### Backend
1. Navigate to `/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Add your `GOOGLE_API_KEY` to `.env`
4. Start server: `python main.py`

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start dev server: ` npm run dev, `

---

*Built by yoges for Sustainable Tourism in India.*
