import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="layout">
      {/* Top Header */}
      <header className="top-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="swiss-cross">✚</div>
            <div className="official-names">
              <div>Schweizerische Eidgenossenschaft</div>
              <div>Confédération suisse</div>
              <div>Confederazione Svizzera</div>
              <div>Confederaziun svizra</div>
            </div>
          </div>
          <div className="agency-title">Bundeskanzlei BK</div>
          <div className="top-nav">
            <a href="#kontakt">Kontakt</a>
            <a href="#medien">Medien</a>
            <a href="#legalisationen">Legalisationen</a>
            <a href="#stellen">Stellenangebot</a>
          </div>
        </div>
        <div className="lang-bar">
          <div className="lang-active">DE</div>
          <div>FR</div>
          <div>IT</div>
          <div>RM</div>
          <div>EN</div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Suchen" />
          <select>
            <option>Themen A-Z</option>
          </select>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="main-nav">
        <button className="nav-item">Unterstützung der Regierung</button>
        <button className="nav-item active">Politische Rechte</button>
        <button className="nav-item">Digitale Transformation und IKT-Lenkung</button>
        <button className="nav-item">Dokumentation</button>
        <button className="nav-item">Über die Bundeskanzlei</button>
      </nav>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Startseite</Link>
        {' > '}
        <span>Politische Rechte</span>
        {' > '}
        <span>Volksinitiativen</span>
        {location.pathname !== '/' && (
          <>
            {' > '}
            <span>Hängige Volksinitiativen</span>
            {' > '}
            <span>Im Sammelstadium</span>
          </>
        )}
      </div>

      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-back">
            <Link to="/">&lt; Politische Rechte</Link>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Volksinitiativen</div>
            <ul className="sidebar-menu">
              <li className="sidebar-active">
                <Link to="/">Im Sammelstadium</Link>
              </li>
              <li><a href="#in-auszahlung">In Auszählung</a></li>
              <li><a href="#beim-bundesrat">Beim Bundesrat hängig</a></li>
              <li><a href="#beim-parlament">Beim Parlament hängig</a></li>
              <li><a href="#abstimmungsreife">Abstimmungsreife Volksinitiativen</a></li>
              <li><a href="#beschwerde">Beschwerde gegen Verfügung hängig</a></li>
              <li><a href="#behandlungsfristen">Ordentliche Behandlungsfristen</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-contact">
          <a href="#kontakt">Fachkontakt</a>
          <div className="last-update">Letzte Änderung 29.10.2025 11:26</div>
        </div>
        <div className="social-icons">
          <a href="#facebook">f</a>
          <a href="#twitter">x</a>
          <a href="#linkedin">in</a>
        </div>
        <div className="back-to-top">
          <a href="#top">Zum Seitenanfang ↑</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

