# E-Collecting - Swiss Popular Initiative Digital Signing Platform

This is a digital signature platform for Swiss popular initiatives, modeled after the Swiss Federal Chancellery website. It allows citizens to view pending initiatives and digitally sign them online.

## Features

- **Initiative List**: View all 10 pending popular initiatives currently in the collection stage
- **Digital Signature**: Sign initiatives using mouse/trackpad on a canvas
- **Form Validation**: Collect required personal information (name, address, birth date)
- **Spam Protection**: Open source captcha
- **Government Design**: Referencing the [Swiss Style Guide](https://github.com/swiss/designsystem)

## Tech Stack

- React 19
- React Router DOM - for navigation
- react-signature-canvas - for digital signature capture
- [cap.js](https://capjs.js.org/) - for bot protection

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

## Project Structure

```
demo/
├── src/
│   ├── components/
│   │   ├── Layout.js           # Main layout with header, nav, sidebar
│   │   ├── Layout.css
│   │   ├── InitiativeList.js   # List of all initiatives
│   │   ├── InitiativeList.css
│   │   ├── InitiativeDetail.js # Individual initiative & signature form
│   │   └── InitiativeDetail.css
│   ├── data/
│   │   └── initiatives.js      # Initiative data
│   ├── App.js                  # Main app component with routing
│   ├── App.css
│   ├── index.js
│   └── index.css
├── public/
└── package.json
```

## Available Initiatives

1. Für die Anerkennung des Staates Palästina
2. Für eine spendenbasierte Fluchthilfe und Schutzgewährung
3. Ja zum Schutz vor missbräuchlichen Mieten
4. Für bewilligungsfreie Solaranlagen
5. Starke Gesellschaft und Wirtschaft dank Elternzeit
6. Für eine volksorientierte Politik (No Lobbying)
7. Für eine finanziell starke, souveräne und verantwortungsvolle Schweiz (Bitcoin)
8. Für einen nachhaltigen und zukunftsgerichteten Finanzplatz Schweiz
9. Für gentechnikfreie Lebensmittel
10. Für den Beitritt zum Atomwaffenverbots-Vertrag

## Digital Signature Flow

1. User browses initiatives on the home page
2. Clicks on an initiative to view full details
3. Reads the initiative text
4. Fills out personal information form
5. Draws signature using mouse/trackpad on canvas
6. Completes reCAPTCHA verification
7. Submits the signature (currently logs to console)

## Next Steps

- Connect to backend API for storing signatures
- Implement authentication and voter verification
- Add multi-language support (FR, IT, RM, EN)
- Generate PDF documents with embedded signatures
- Add signature encryption and security measures

## License

This project is part of the e-collecting hackathon team 5.
