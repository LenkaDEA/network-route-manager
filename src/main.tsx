import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.scss'
import App from './App/App.tsx'
import './config/configureMobX.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
