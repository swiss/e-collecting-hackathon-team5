import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InitiativeList from './components/InitiativeList';
import InitiativeDetail from './components/InitiativeDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<InitiativeList />} />
          <Route path="/initiative/:id" element={<InitiativeDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
