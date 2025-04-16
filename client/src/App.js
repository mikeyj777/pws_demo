import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import './styles/global.css';
import PhastInputForm from './components/PhastInputForm';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<PhastInputForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;