# 🎨 Inscribe - Real-time Collaborative Drawing App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101)](https://socket.io/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://inscribe-lsww.onrender.com/)

Inscribe is an intuitive and engaging web application that allows users to create and share drawings in real-time with others. Whether you're brainstorming ideas, working on a shared project, or simply doodling for fun, Inscribe lets you draw, chat, and collaborate seamlessly. The application features a modern, responsive design with light and dark themes, and is built with security and performance in mind.

## ✨ Features

- 🎨 **Real-time Collaborative Drawing**
  - Draw with multiple users simultaneously
  - Multiple brush types and colors
  - Eraser and undo/redo functionality
  - Responsive canvas with zoom and pan support

- 💬 **Built-in Chat**
  - Real-time messaging
  - User presence indicators
  - Message history
  - Typing indicators

- 🎨 **Modern UI/UX**
  - Light and dark themes
  - Responsive design
  - Intuitive toolbar
  - Keyboard shortcuts

- 🔒 **Security & Performance**
  - Rate limiting and input sanitization
  - Secure WebSocket connections
  - Optimized rendering
  - Offline support with auto-reconnect

- 🛠 **Developer Friendly**
  - Well-documented code
  - Environment configuration
  - Linting and formatting
  - Easy deployment

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

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/Keshabkjha/Inscribe?style=social)
![GitHub forks](https://img.shields.io/github/forks/Keshabkjha/Inscribe?style=social)
![GitHub issues](https://img.shields.io/github/issues/Keshabkjha/Inscribe)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Keshabkjha/Inscribe)
![GitHub contributors](https://img.shields.io/github/contributors/Keshabkjha/Inscribe)
![GitHub last commit](https://img.shields.io/github/last-commit/Keshabkjha/Inscribe)