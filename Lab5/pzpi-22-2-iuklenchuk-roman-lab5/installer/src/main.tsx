import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GlobalStyle from './global.style.ts'
import { ToastContainer } from 'react-toastify'
import App from './app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <ToastContainer />
    <App />
  </StrictMode>,
)
