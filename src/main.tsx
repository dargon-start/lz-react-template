import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import '@ant-design/v5-patch-for-react-19'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>
  // </StrictMode>
)
