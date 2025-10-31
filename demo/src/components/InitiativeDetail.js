import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import ReCAPTCHA from 'react-google-recaptcha';
import { initiatives } from '../data/initiatives';
import { swissCantons } from '../data/swissCantons';
import { downloadInitiativePDF, generatePDFDataURL } from '../utils/pdfGenerator';
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
    postalCode: '',
    canton: '',
    municipality: ''
  });
  
  const [signature, setSignature] = useState(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerTimeLeft, setDisclaimerTimeLeft] = useState(7);
  
  const sigCanvasRef = useRef(null);
  const recaptchaRef = useRef(null);

  // Countdown effect for disclaimer
  useEffect(() => {
    if (showDisclaimer && disclaimerTimeLeft > 0) {
      const timer = setTimeout(() => {
        setDisclaimerTimeLeft(disclaimerTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (disclaimerTimeLeft === 0) {
      setShowDisclaimer(false);
    }
  }, [showDisclaimer, disclaimerTimeLeft]);

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
    
    // Generate PDF and show feedback
    try {
      const pdfUrl = generatePDFDataURL(initiative, formData, signature);
      setPdfDataUrl(pdfUrl);
      setShowFeedback(true);
      setSubmitted(true);
      
      // Auto-download PDF
      downloadInitiativePDF(initiative, formData, signature);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Fehler beim Generieren der PDF. Bitte versuchen Sie es erneut.');
    }
  };
  
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setPdfDataUrl(null);
    setSubmitted(false);
    
    // Reset form
    setFormData({
      lastName: '',
      firstName: '',
      birthDate: '',
      address: '',
      city: '',
      postalCode: '',
      canton: '',
      municipality: ''
    });
    setSignature(null);
    setIsCaptchaVerified(false);
    sigCanvasRef.current.clear();
    recaptchaRef.current.reset();
  };
  
  const handleDownloadPDF = () => {
    if (pdfDataUrl) {
      downloadInitiativePDF(initiative, formData, signature);
    }
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

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="disclaimer-overlay">
          <div className="disclaimer-modal">
            <div className="disclaimer-header">
              <h2>⚠ WICHTIG: Gesetzliche Bestimmungen</h2>
            </div>
            
            <div className="disclaimer-content">
              <div className="disclaimer-article">
                <h3>Art. 281 - Wählerbeeinflussung</h3>
                <p>
                  Wer einem Stimmberechtigten ein Geschenk oder einen andern Vorteil anbietet, verspricht, 
                  gibt oder zukommen lässt, damit er in einem bestimmten Sinne stimme oder wähle, einem 
                  Referendums- oder einem Initiativbegehren beitrete oder nicht beitrete; wer einem 
                  Stimmberechtigten ein Geschenk oder einen andern Vorteil anbietet, verspricht, gibt 
                  oder zukommen lässt, damit er an einer Wahl oder Abstimmung nicht teilnehme; wer sich 
                  als Stimmberechtigter einen solchen Vorteil versprechen oder geben lässt, wird mit 
                  Freiheitsstrafe bis zu drei Jahren oder Geldstrafe bestraft.
                </p>
              </div>

              <div className="disclaimer-article">
                <h3>Art. 282 - Wahlfälschung</h3>
                <p>
                  Wer das Ergebnis einer Wahl, einer Abstimmung oder einer Unterschriftensammlung zur 
                  Ausübung des Referendums oder der Initiative fälscht, insbesondere durch Hinzufügen, 
                  Ändern, Weglassen oder Streichen von Stimmzetteln oder Unterschriften, durch unrichtiges 
                  Auszählen oder unwahre Beurkundung des Ergebnisses, wird mit Freiheitsstrafe bis zu 
                  drei Jahren oder Geldstrafe bestraft.
                </p>
                <p style={{ marginTop: '15px' }}>
                  <strong>Handelt der Täter in amtlicher Eigenschaft, so ist die Strafe Freiheitsstrafe 
                  von einem Monat bis zu drei Jahren oder Geldstrafe nicht unter 30 Tagessätzen.</strong>
                </p>
              </div>

              <div className="disclaimer-countdown">
                <p>Bitte lesen Sie diese Bestimmungen sorgfältig durch.</p>
                <div className="countdown-timer">
                  Weiter in {disclaimerTimeLeft} Sekunden...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Name 
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
                Vornamen
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
                Geburtsdatum (Tag/Monat/Jahr) 
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
                Wohnadresse (Strasse und Hausnummer) 
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
              <label htmlFor="postalCode">Postleitzahl </label>
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
              <label htmlFor="city">Ort </label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="canton">Kanton </label>
              <select
                id="canton"
                name="canton"
                value={formData.canton}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">-- Kanton wählen --</option>
                {swissCantons.map(canton => (
                  <option key={canton.code} value={canton.code}>
                    {canton.code} - {canton.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="municipality">Politische Gemeinde </label>
              <input
                type="text"
                id="municipality"
                name="municipality"
                value={formData.municipality}
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

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-overlay">
          <div className="feedback-modal">
            <div className="feedback-header">
              <h2>✓ Unterschrift erfolgreich übermittelt!</h2>
              <button onClick={handleCloseFeedback} className="close-btn">×</button>
            </div>
            
            <div className="feedback-content">
              <div className="success-message">
                <p>Vielen Dank für Ihre Unterschrift!</p>
                <p>Ihre digitale Unterschrift wurde erfolgreich gespeichert.</p>
              </div>

              {pdfDataUrl && (
                <div className="pdf-preview">
                  <h3>PDF-Vorschau</h3>
                  <iframe
                    src={pdfDataUrl}
                    title="PDF Preview"
                    className="pdf-iframe"
                  />
                  <div className="pdf-actions">
                    <button onClick={handleDownloadPDF} className="btn-primary">
                      📥 PDF erneut herunterladen
                    </button>
                  </div>
                </div>
              )}

              <div className="feedback-info">
                <p><strong>Nächste Schritte:</strong></p>
                <ul>
                  <li>Bewahren Sie Ihr PDF sicher auf</li>
                  <li>Die Unterschrift wird an das Komitee übermittelt</li>
                  <li>Sie erhalten eine Bestätigungs-E-Mail</li>
                </ul>
              </div>
            </div>

            <div className="feedback-footer">
              <button onClick={handleCloseFeedback} className="btn-secondary">
                Schliessen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeDetail;

