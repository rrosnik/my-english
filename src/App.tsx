import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import { auth, firebaseAuth } from './firebase';
import router from './router';

function App() {

  firebaseAuth.onAuthStateChanged(auth, user => {
    console.log('user', user)
  });


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
