import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import allReducers from './store/store.js'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <Provider store={allReducers}>
    <App />
  </Provider>,
)
