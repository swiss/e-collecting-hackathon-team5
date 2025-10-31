import React from 'react';
import { Link } from 'react-router-dom';
import { initiatives } from '../data/initiatives';
import './InitiativeList.css';

const InitiativeList = () => {
  return (
    <div className="initiative-list">
      <h1 className="page-title">Im Sammelstadium</h1>
      
      <div className="initiative-table">
        <table>
          <thead>
            <tr>
              <th className="col-pdf">Unterschriftenlisten</th>
              <th className="col-title">Titel</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((initiative) => (
              <tr key={initiative.id}>
                <td className="pdf-link">
                  <Link to={`/initiative/${initiative.id}`} className="pdf-icon">
                    📄 Initiative {initiative.id}
                  </Link>
                </td>
                <td className="initiative-title-link">
                  <Link to={`/initiative/${initiative.id}`}>
                    {initiative.title}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box">
        <strong>ℹ Hinweis:</strong> Klicken Sie auf eine Initiative, um mehr zu erfahren und 
        digitale Unterschrift zu leisten.
      </div>
    </div>
  );
};

export default InitiativeList;

