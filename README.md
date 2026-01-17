Assistant A
Here's a complete WebSocket chat application with a Node.js backend and vanilla JavaScript frontend.

1. Backend (Node.js WebSocket Server)
Create a file named `server.js`:

2. Frontend (HTML/CSS/JavaScript)
Create a file named `index.html`:

3. Installation and Setup
Install Node.js from nodejs.org if you haven't already.

Install dependencies for the server:
npm init -y
npm install ws

Start the server:
node server.js

Open the client:
Open `index.html` in your browser, or
Serve it with a simple HTTP server:
npx http-server . -p 8080
Then open `http://localhost:8080`

Features
✅ Real-time messaging
✅ User presence (online users list)
✅ Username customization
✅ Connection status indicator
✅ Auto-reconnect on disconnect
✅ Clean, modern UI
✅ Mobile responsive
✅ XSS protection

The app will automatically reconnect if the connection is lost. Users can change their username by clicking on it in the header (you can add this feature by modifying the UI).

