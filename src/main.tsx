import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { store } from './redux/store';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<h1>Loading ...</h1>}>
      <Provider store={store} >
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>,
)
