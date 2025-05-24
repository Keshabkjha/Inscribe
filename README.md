# 🎨 Inscribe - Real-time Collaborative Drawing App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101)](https://socket.io/)

Inscribe is an intuitive and engaging web application that allows users to create and share drawings in real-time with others. Whether you're brainstorming ideas, working on a shared project, or simply doodling for fun, Inscribe lets you draw, chat, and collaborate seamlessly.

## ✨ Features

- 🎨 Real-time collaborative drawing
- 💬 Built-in chat functionality
- 👥 Multiple users can draw simultaneously
- 💾 Automatic drawing history
- 🔒 Secure with rate limiting and input sanitization
- 🚀 Built with Node.js and Socket.IO

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- MongoDB (for persistent storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Keshabkjha/Inscribe.git
   cd Inscribe
   ```

2. Install dependencies:
   ```bash
   npm install express http socket.io express-rate-limit mongoose dotenv sanitize-html
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm start` - Start the development server
- `npm run dev` - Start the development server with nodemon

### Project Structure

```
Inscribe/
├── public/           # Static files (HTML, CSS, JS)
├── server.js         # Main server file
├── package.json      # Project dependencies and scripts
├── .env              # Environment variables
└── .gitignore        # Git ignore file
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Keshab Kumar Jha 
- Email: keshabkumarjha876@gmail.com
- GitHub: [@keshabkjha](https://github.com/Keshabkjha)
- LinkedIn: [keshabkjha](https://www.linkedin.com/in/keshabkjha/)

Project Link: [https://github.com/Keshabkjha/Inscribe](https://github.com/Keshabkjha/Inscribe)

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)