import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import InsertPage from './pages/InsertPage';
import ReviewPage from './pages/ReviewPage';
import './App.scss';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='my-english'>
        <Routes>
          <Route index element={<Navigate to="insert" />} />
          <Route path='sign-in' element={<LoginPage />} />
          <Route path='sign-up' element={<SignupPage />} />
          <Route path='' element={<AppLayout />}>
            <Route path='insert' element={<InsertPage />} />
            <Route path='review' element={<ReviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </div>
  );
}

export default App;
