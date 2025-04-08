import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './utilities/ThemeContext.jsx'
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
<ThemeProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</ThemeProvider>
)
