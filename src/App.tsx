import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import router from './router';
import apis from './apis';

function App() {



  useEffect(() => {
    const unsubscribAutListener = apis.auth.alwaysCheckTheUserAuthStatus();
    return () => {
      unsubscribAutListener();
    }
  }, []);

  return (
    <div className="App">
      <RouterProvider
        router={router}
        fallbackElement={<h1>Loading ...</h1>}
      />
    </div>
  );
}

export default App;
