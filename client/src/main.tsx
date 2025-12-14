import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistedStore ,store } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import ErrorBoundary from './components/ErrorBoundary'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>} persistor={persistedStore}>
          <App />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)


