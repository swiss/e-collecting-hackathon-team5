import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import ReCAPTCHA from 'react-google-recaptcha';
import { initiatives } from '../data/initiatives';
import './InitiativeDetail.css';

const InitiativeDetail = () => {
  const { id } = useParams();
  const initiative = initiatives.find(init => init.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    birthDate: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [signature, setSignature] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const sigCanvasRef = useRef(null);
  const recaptchaRef = useRef(null);

  if (!initiative) {
    return (
      <div className="error-message">
        <h2>Initiative nicht gefunden</h2>
        <Link to="/">Zurück zur Liste</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClearSignature = () => {
    sigCanvasRef.current.clear();
    setSignature(null);
  };

  const handleSaveSignature = () => {
    if (sigCanvasRef.current) {
      const dataURL = sigCanvasRef.current.toDataURL();
      setSignature(dataURL);
    }
  };

  const handleCaptchaVerify = (token) => {
    setIsCaptchaVerified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!signature) {
      alert('Bitte leisten Sie eine Unterschrift.');
      return;
    }
    
    if (!isCaptchaVerified) {
      alert('Bitte bestätigen Sie, dass Sie kein Roboter sind.');
      return;
    }

    // Here you would normally send the data to a server
    console.log('Form submitted:', { formData, signature });
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        lastName: '',
        firstName: '',
        birthDate: '',
        address: '',
        city: '',
        postalCode: ''
      });
      setSignature(null);
      setIsCaptchaVerified(false);
      sigCanvasRef.current.clear();
      recaptchaRef.current.reset();
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="initiative-detail">
      <div className="detail-header">
        <h1 className="detail-title">
          Eidgenössische Volksinitiative «{initiative.title}»
        </h1>
        <Link to="/" className="back-link">← Zurück zur Liste</Link>
      </div>

      <div className="detail-reference">
        <strong>Referenz:</strong> {initiative.reference}
      </div>

      <div className="full-text-section">
        <h2>
          <a href="#full-text" className="full-text-link">
            Die Initiative im Wortlaut
          </a>
        </h2>
      </div>

      <div className="timeline-table">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Fundstelle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vorprüfung vom:</td>
              <td>{initiative.preliminaryReview} | BBI 2025 2984</td>
            </tr>
            <tr>
              <td>Ablauf Sammelfrist:</td>
              <td>{initiative.collectionEnd}</td>
            </tr>
            <tr>
              <td>Sammelbeginn:</td>
              <td>{initiative.collectionStart}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="initiative-info">
        <p><strong>Form:</strong> {initiative.form}</p>
        <p><strong>Komitee:</strong> {initiative.committee}</p>
      </div>

      {/* Full Text */}
      <div id="full-text" className="full-text">
        <h2>Volltext der Initiative</h2>
        <div className="initiative-text">
          {initiative.fullText.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Legal Warning */}
      <div className="warning-box">
        <strong>⚠ Warnung:</strong> Bestechung oder Fälschung bei der Unterschriftensammlung 
        ist nach Art. 281 oder 282 des Strafgesetzbuches strafbar.
      </div>

      {/* Signature Form */}
      <div className="signature-section">
        <h2>Digitale Unterschrift</h2>
        <p className="form-description">
          Bitte füllen Sie das Formular aus und leisten Sie eine digitale Unterschrift. 
          Nur berechtigte Stimmbürgerinnen und Stimmbürger dürfen unterschreiben.
        </p>

        <form onSubmit={handleSubmit} className="signature-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName">
                Name (eigenhändig und möglichst in Blockschrift) *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">
                Vornamen (eigenhändig und möglichst in Blockschrift) *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">
                Geburtsdatum (Tag/Monat/Jahr) *
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="address">
                Wohnadresse (Strasse und Hausnummer) *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Postleitzahl *</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">Ort *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Signature Canvas */}
          <div className="signature-canvas-section">
            <label>Eigenhändige Unterschrift *</label>
            <div className="signature-wrapper">
              <SignatureCanvas
                ref={sigCanvasRef}
                canvasProps={{
                  className: 'signature-canvas',
                  width: 600,
                  height: 200
                }}
              />
            </div>
            <div className="signature-controls">
              <button type="button" onClick={handleSaveSignature} className="btn-secondary">
                Unterschrift speichern
              </button>
              <button type="button" onClick={handleClearSignature} className="btn-secondary">
                Löschen
              </button>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="captcha-section">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleCaptchaVerify}
            />
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button type="submit" className="btn-primary">
              {submitted ? '✓ Erfolgreich übermittelt!' : 'Unterschrift übermitteln'}
            </button>
          </div>

          <div className="deadline-info">
            <strong>Abgabe bis:</strong> {initiative.collectionEnd}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitiativeDetail;

