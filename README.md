# EcoHome - Energy Profile Wizard

A React-based web application that helps users understand their home energy usage and provides personalized energy-saving recommendations.

## 🚀 Features

- **Multi-step Wizard**: Interactive 5-question assessment to collect energy profile data
- **Progress Tracking**: Visual progress indicator showing current step
- **Navigation**: Back, Skip, and Next buttons for flexible navigation
- **Summary Screen**: Displays collected profile data and initial recommendations
- **AI Prompt Generation**: Generates formatted prompts ready for OpenAI integration
- **Responsive Design**: Bootstrap-styled, mobile-friendly interface

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Bootstrap 5.3.3** for styling
- **Functional Components** with Hooks

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/NaminduWathsala/EcoHome.git
cd EcoHome
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (typically `http://localhost:5173`)

## 🏗️ Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
EcoHome/
├── src/
│   ├── components/
│   │   ├── LandingScreen.tsx
│   │   ├── QuestionStep.tsx
│   │   └── SummaryScreen.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 Usage

1. **Landing Screen**: Click "Start Assessment" to begin
2. **Question Steps**: Answer 5 questions about your energy usage:
   - House size
   - Heating usage per day
   - Daily appliances
   - Monthly electricity bill
   - Additional information (optional)
3. **Summary Screen**: Review your profile, see recommendations, and view the generated AI prompt

## 🔮 Future Enhancements

- Backend integration for OpenAI API calls
- User authentication and profile saving
- Historical data tracking
- More detailed energy analytics

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Namindu Wathsala**
- GitHub: [@NaminduWathsala](https://github.com/NaminduWathsala)

