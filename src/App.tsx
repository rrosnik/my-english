import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import InsertPage from './pages/InsertPage';
import ReviewPage from './pages/ReviewPage';
import './App.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='my-english'>
        <Routes>
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
