<div align="center">
  <h1>🎨 Inscribe</h1>
  <h3>Real-time Collaborative Drawing App</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101)](https://socket.io/)
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://inscribe-lsww.onrender.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  [![GitHub stars](https://img.shields.io/github/stars/Keshabkjha/Inscribe?style=social)](https://github.com/Keshabkjha/Inscribe/stargazers)
  
  <p align="center">
    <img src="https://img.shields.io/badge/Real%20Time-Collaboration-blue" alt="Real-time Collaboration">
    <img src="https://img.shields.io/badge/Open%20Source-💖-blue" alt="Open Source">
    <img src="https://img.shields.io/badge/Responsive-Design-blue" alt="Responsive Design">
  </p>
</div>

## 📝 Table of Contents
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🌐 Deployment](#-deployment)
- [🔧 Development](#-development)
- [🧰 Tech Stack](#-tech-stack)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📧 Contact](#-contact)
- [🙏 Acknowledgments](#-acknowledgments)
- [🌟 Features Coming Soon](#-features-coming-soon)
- [📊 Stats](#-stats)

## ✨ Features

### 🎨 Real-time Collaborative Drawing
- **Multi-user Canvas**: Draw simultaneously with others in real-time
- **Rich Toolset**:
  - Multiple brush types (pencil, marker, highlighter)
  - Customizable colors and brush sizes
  - Eraser with adjustable size
  - Undo/Redo functionality
  - Clear canvas option
- **Responsive Canvas**:
  - Works on all device sizes
  - Smooth zoom and pan functionality
  - Auto-resize on window change

### 💬 Built-in Chat System
- Real-time messaging
- User presence indicators (online/offline)
- Message history with timestamps
- Typing indicators
- Emoji support
- User mentions

### 🎨 Modern UI/UX
- **Themes**:
  - Light and dark mode
  - Custom theme support
  - System preference detection
- **Intuitive Interface**:
  - Clean, modern design
  - Keyboard shortcuts for power users
  - Tooltips and helpful hints
  - Responsive layout for all devices

### 🔒 Security & Performance
- **Security Features**:
  - Input sanitization
  - Rate limiting on API endpoints
  - Secure WebSocket connections (WSS)
  - CORS protection
- **Performance Optimizations**:
  - Efficient canvas rendering
  - WebSocket connection optimization
  - Lazy loading of assets
  - Client-side caching

### 🛠 Developer Experience
- Comprehensive API documentation
- Environment-based configuration
- Linting and code formatting
- Detailed logging
- Error tracking integration
- Automated testing suite

## 🚀 Quick Start

Get started with Inscribe in under 5 minutes:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keshabkjha/Inscribe.git
   cd Inscribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:3000` to start using Inscribe!

## ⚙️ Installation

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- MongoDB Atlas account (for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Keshabkjha/Inscribe.git
   cd Inscribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update the variables in `.env` with your configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the server with hot-reload enabled.

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Render.com (Recommended)

1. **Push your code** to a GitHub repository
2. **Create a new Web Service** on [Render](https://render.com/)
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: inscribe
   - **Region**: Choose the one closest to your users
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Add environment variables** from your `.env` file
6. **Deploy!** Click "Create Web Service"

### MongoDB Atlas Setup

1. **Create a free MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new project** and build a free shared cluster
3. **Set up database access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a secure password
   - Assign "Atlas Admin" role
4. **Configure network access**:
   - Go to "Network Access"
   - Add your IP address or `0.0.0.0/0` for all IPs (not recommended for production)
5. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
6. **Update your `.env` file** with the connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inscribe?retryWrites=true&w=majority
   ```

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (coming soon)

### Project Structure

```
Inscribe/
├── public/               # Static files
│   ├── index.html        # Main HTML file
│   ├── script.js         # Client-side JavaScript
│   └── styles.css        # Main stylesheet
├── server/               # Server-side code
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── test/                # Test files
├── .env.example         # Example environment variables
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

### Environment Variables

See [.env.example](.env.example) for all available environment variables.

## 🧰 Tech Stack

- **Frontend**:
  - HTML5 Canvas API
  - Vanilla JavaScript (ES6+)
  - CSS3 with Flexbox/Grid
  - Responsive Design

- **Backend**:
  - Node.js
  - Express.js
  - Socket.IO
  - MongoDB with Mongoose

- **Dev Tools**:
  - ESLint
  - Prettier
  - Nodemon
  - Git

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style
- Follow existing code style and formatting
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features

### Reporting Issues
Found a bug? Please open an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Keshab Kumar Jha**  
Email: [keshabkumarjha876@gmail.com](mailto:keshabkumarjha876@gmail.com)  
GitHub: [@Keshabkjha](https://github.com/Keshabkjha)  
LinkedIn: [keshabkjha](https://www.linkedin.com/in/keshabkjha/)  

Project Link: [https://github.com/Keshabkjha/Inscribe](https://github.com/Keshabkjha/Inscribe)

## 🙏 Acknowledgments

Special thanks to these amazing projects that make Inscribe possible:

- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Drawing graphics on the web
- [Font Awesome](https://fontawesome.com/) - Awesome icons
- [Google Fonts](https://fonts.google.com/) - Beautiful, free, open-source fonts
- [Render](https://render.com/) - Simple cloud for developers

## 🌟 Features Coming Soon

### 🚧 In Progress
- [ ] User authentication system
- [ ] Multiple drawing rooms
- [ ] Drawing export options (PNG, JPG, SVG)

### 📅 Planned
- [ ] Text tool with formatting
- [ ] Shape recognition
- [ ] Sticker packs
- [ ] Collaborative cursors
- [ ] Version history
- [ ] Offline mode
- [ ] Touch screen support
- [ ] Custom brushes
- [ ] Layer support
- [ ] Keyboard shortcuts customization

### 💡 Ideas
- [ ] Real-time collaboration with video/audio
- [ ] Template library
- [ ] Integration with cloud storage
- [ ] Mobile app versions

## 📊 Stats

[![GitHub stars](https://img.shields.io/github/stars/Keshabkjha/Inscribe?style=social)](https://github.com/Keshabkjha/Inscribe/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Keshabkjha/Inscribe?style=social)](https://github.com/Keshabkjha/Inscribe/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Keshabkjha/Inscribe)](https://github.com/Keshabkjha/Inscribe/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Keshabkjha/Inscribe)](https://github.com/Keshabkjha/Inscribe/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/Keshabkjha/Inscribe)](https://github.com/Keshabkjha/Inscribe/graphs/contributors)
[![GitHub last commit](https://img.shields.io/github/last-commit/Keshabkjha/Inscribe)](https://github.com/Keshabkjha/Inscribe/commits/main)
[![GitHub license](https://img.shields.io/github/license/Keshabkjha/Inscribe)](https://github.com/Keshabkjha/Inscribe/blob/main/LICENSE)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Keshabkjha">Keshab Kumar Jha</a>
</div>



## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- MongoDB Atlas account (for production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Keshabkjha/Inscribe.git
   cd Inscribe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables in `.env` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Render.com (Recommended)

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: inscribe
   - **Region**: Choose the closest to your users
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from your `.env` file
6. Click "Create Web Service"

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and build a free shared cluster
3. Create a database user with read/write access
4. Add your IP address to the IP whitelist
5. Get your connection string from the "Connect" button
6. Update the `MONGODB_URI` in your `.env` file

## 🛠 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

### Environment Variables

See [.env.example](.env.example) for all available environment variables.
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Keshab Kumar Jha 
- Email: keshabkumarjha876@gmail.com
- GitHub: [@keshabkjha](https://github.com/Keshabkjha)
- LinkedIn: [keshabkjha](https://www.linkedin.com/in/keshabkjha/)

Project Link: [https://github.com/Keshabkjha/Inscribe](https://github.com/Keshabkjha/Inscribe)

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Drawing graphics on the web
- [Font Awesome](https://fontawesome.com/) - Awesome icons
- [Google Fonts](https://fonts.google.com/) - Beautiful, free, open-source fonts

## 🌟 Features Coming Soon

- [ ] User authentication
- [ ] Multiple drawing rooms
- [ ] Drawing export options (PNG, JPG, SVG)
- [ ] Text tool
- [ ] Shape recognition
- [ ] Sticker packs
- [ ] Collaborative cursors
- [ ] Version history