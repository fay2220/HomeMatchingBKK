import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HomePage } from './pages/homePage.tsx'
import { QuizPage } from './pages/quizPage.tsx'
import { PropertiesPage } from './pages/resultPage.tsx'
import { Route, Switch } from "wouter"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/dashboard" component={PropertiesPage} />
    </Switch>
  </StrictMode>,
)
