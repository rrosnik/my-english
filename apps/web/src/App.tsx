import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import router from './router';
import apis from './apis';
import { useSelector } from 'react-redux';
import { AppStatusType } from './redux/reducers/addReducer';
import { RootState } from './redux/store';

function App() {
  const appStatus: AppStatusType = useSelector<RootState, AppStatusType>((states) => states.app.appStatus);
  useEffect(() => {
    const unsubscribAutListener = apis.auth.alwaysCheckTheUserAuthStatus();
    return () => {
      unsubscribAutListener();
    };
  }, []);

  if (appStatus === 'initializing') {
    return <h1>Loading</h1>;
  } else
    return (
      <div className="App">
        <RouterProvider router={router} fallbackElement={<h1>Loading ...</h1>} />
      </div>
    );
}

export default App;
