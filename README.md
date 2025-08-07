# Reading Passage - React App on GitHub Pages

A React application built with Vite and deployed on GitHub Pages with automated CI/CD using GitHub Actions.

## 🚀 Live Demo

Visit the live application: [https://dnslp.github.io/reading-passage](https://dnslp.github.io/reading-passage)

## 🛠️ Technology Stack

- **React 19** - Frontend JavaScript library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated deployment pipeline

## 📦 Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dnslp/reading-passage.git
   cd reading-passage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (manual deployment)

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Push to `main` branch triggers GitHub Actions workflow
2. **Manual Deployment**: Run `npm run deploy` (requires gh-pages package)

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch
5. The site will be available at `https://dnslp.github.io/reading-passage`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Home.jsx
│   └── About.jsx
├── assets/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## ⚡ Features

- React 19 with modern hooks
- React Router for navigation
- Responsive design
- GitHub Pages deployment
- Automated CI/CD pipeline
- Fast development with Vite HMR

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Create a pull request
