# 🎮 Arden's Playground

**An Interactive AI-Powered Automata Theory Laboratory**

> Visualize Automata. Solve with Arden. Learn Regular Expressions Interactively.

Arden's Playground is a modern web-based platform for learning **Theory of Automata and Formal Languages (TAFL)**. It provides an intuitive visual interface to build finite automata, simulate string acceptance, generate state equations, and derive regular expressions using **Arden's Theorem** — all in real-time.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖊️ **Interactive DFA/NFA Builder** | Drag-and-drop graph editor to create states, transitions, and automata visually |
| ▶️ **String Simulation Engine** | Animate input string traversal with real-time state highlighting |
| 🧮 **Arden Equation Generator** | Auto-generates state equations from the transition function |
| 📐 **Regular Expression Generator** | Derives the equivalent RE with a full step-by-step derivation pipeline |
| 🔍 **Step-by-Step Arden Solver** | Visual derivation showing equation building, recursion detection, theorem application |
| 📊 **Transition Tables** | View the automaton as a structured transition table alongside the graph |
| 🤖 **AI Automata Tutor** | Integrated Google Gemini-powered AI assistant for real-time TAFL Q&A |
| 🎨 **Animated Graph Visualization** | Smooth SVG edge curves, self-loops, and bidirectional transitions |

---

## 📸 Screenshots

### Landing Page
The platform features a premium dark-themed landing page that introduces core automata theory concepts, Kleene's Theorem, and Arden's Theorem with interactive visualizations and KaTeX-rendered mathematical formulas.

### Main Platform
The interactive playground provides a full-featured automata builder with a graph canvas, control panel, sidebar, equation panel, and AI chat — all in a single responsive layout.

---

## 🧠 Theoretical Background

### Automata Theory
Automata Theory is a branch of theoretical computer science that studies abstract computational machines (automata) and the problems they can solve. It forms the mathematical foundation of compilers, regular expressions, lexical analyzers, and parsers.

### Key Concepts

- **DFA (Deterministic Finite Automaton)** — For every state and input symbol, there is exactly one transition
- **NFA (Non-deterministic Finite Automaton)** — Allows multiple transitions for a single input
- **ε-NFA** — Extends NFA with epsilon (empty string) transitions
- **Regular Expressions** — Algebraic notation for describing regular languages

### Kleene's Theorem
Establishes the equivalence between finite automata and regular expressions:
- Every **Regular Expression** can be converted to a **Finite Automaton**
- Every **Finite Automaton** can be converted to a **Regular Expression**

### Arden's Theorem
Provides an algebraic method to solve recursive state equations:

> **If R = Q + RP, then R = QP\***

Where:
- **R** is the state being solved
- **Q** represents non-recursive terms
- **P** is the recursive (self-loop) coefficient

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **React Flow** | Graph-based automata canvas |
| **Framer Motion** | Animations and transitions |
| **KaTeX** | Mathematical equation rendering |
| **Google Gemini API** | AI-powered automata tutor |
| **Lucide React** | Icon system |
| **html-to-image** | PNG export of automata diagrams |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- A **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AnshulK-01/ArdenPlayground.git
cd ArdenPlayground

# 2. Install dependencies
npm install

# 3. Create environment file
# Create a .env file in the root directory:
echo VITE_GEMINI_API_KEY=your_api_key_here > .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000/`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for the AI tutor | Yes |

---

## 📁 Project Structure

```
ArdenPlayground/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIChat.jsx       # AI tutor chat panel
│   │   ├── ArdenTimeline.jsx# Step-by-step derivation pipeline
│   │   ├── AutomataCanvas.jsx# React Flow graph canvas
│   │   ├── AutomataEdge.jsx # Custom SVG edge rendering
│   │   ├── AutomataNode.jsx # Custom state node rendering
│   │   ├── ControlBar.jsx   # Bottom control bar
│   │   ├── ControlPanel.jsx # State/transition management
│   │   ├── EquationPanel.jsx# State equation display
│   │   ├── LabSidebar.jsx   # Left sidebar panel
│   │   └── Navbar.jsx       # Top navigation bar
│   ├── logic/               # Core computational logic
│   │   ├── ardenSolver.js   # Arden's Theorem solver
│   │   ├── equationBuilder.js# State equation generator
│   │   └── simulator.js     # String simulation engine
│   ├── services/
│   │   └── gemini.js        # Google Gemini AI integration
│   ├── pages/
│   │   ├── LandingPage.jsx  # Landing page shell
│   │   └── landing/         # Landing page sections
│   │       ├── HeroSection.jsx
│   │       ├── AboutSection.jsx
│   │       ├── KleenesSection.jsx
│   │       ├── ArdensSection.jsx
│   │       ├── HowItWorks.jsx
│   │       ├── FeaturesSection.jsx
│   │       ├── AISection.jsx
│   │       ├── ArdenDemo.jsx
│   │       ├── CTASection.jsx
│   │       └── Footer.jsx
│   ├── examples/
│   │   └── sampleDFAs.js    # Pre-built example automata
│   ├── styles/
│   │   └── landing.css      # Landing page styles
│   ├── App.jsx              # Main platform component
│   ├── main.jsx             # Entry point with routing
│   └── index.css            # Global styles and design tokens
├── .env                     # API keys (not committed)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔬 How It Works

### Step-by-Step Arden's Theorem Derivation

1. **Build State Equations** — Generate equations for each state based on incoming transitions
2. **Detect Recursive Equations** — Identify equations where a state appears on both sides (self-loop)
3. **Compare with Arden's Form** — Match each recursive equation to `R = Q + RP`
4. **Apply Arden's Theorem** — Transform using `R = QP*` to eliminate recursion
5. **Substitute & Simplify** — Back-substitute resolved expressions
6. **Generate Final RE** — Combine expressions for all final/accepting states

### Example

Given a DFA with states `{q0, q1, q2}`:

```
State Equations:
  q0 = ε + q2·b
  q1 = q0·a + q2·a
  q2 = q0·b + q1·a + q2·a    ← recursive!

Apply Arden's Theorem on q2:
  R = q2, Q = q0·b + q1·a, P = a
  q2 = (q0·b + q1·a)·a*

Final RE (if q2 is accepting):
  RE = (q0·b + q1·a)·a*
```

---

## 🤖 AI Tutor — "Padhne Wala Baccha"

The integrated AI assistant can help with:

- Explaining DFA, NFA, and ε-NFA concepts
- Step-by-step Arden's Theorem walkthroughs
- Regular expression derivation explanations
- Debugging why a string is accepted/rejected
- General TAFL theory questions

Powered by **Google Gemini 2.5 Flash** for fast, accurate responses.

---

## 👥 Team

| Name | Role |
|------|------|
| **Anshul** | Lead Developer |
| **Dhananjya** | Tester |
| **Abhinaw** | Tester |
| **Ritik** | Tester |

**Institution:** JSS University, Noida (JSSUN'28)  
**Department:** CSE - Artificial Intelligence & Machine Learning  
**Subject:** Theory of Automata and Formal Languages (TAFL)

---

## 📄 License

This project is built for academic purposes as part of the TAFL coursework at JSS University, Noida.

---

<p align="center">
  <b>Arden's Playground</b> — Visualize. Solve. Learn.<br/>
  <sub>An interactive automata theory laboratory</sub>
</p>
