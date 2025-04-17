# 🎯 Autodarts OBS Overlay Server

This is a lightweight Node.js server that powers a modern OBS overlay for your Autodarts.io matches — including player names, scores, throws, game mode, and winner animations.

---

## ⚙️ Setup & Start

### 1. Clone the Repo or Download the Server Folder

If you only have the `server` folder, place it anywhere on your system.

---

### 2. Install Dependencies

Open a terminal inside the `server/` folder and run:

```bash
npm install
```

This installs all required Node.js packages.

---

### 3. Start the Server

Start the local server with:

```bash
node server.js
```

> The server will start on [http://localhost:3000](http://localhost:3000)

---

## 🎥 Connect with OBS

1. In OBS, add a new **Browser Source**
2. Set the URL to:

```
http://localhost:3000/overlay.html
```

3. Width: `1920`, Height: `1080`  
4. Enable **"Transparent Background"** if needed  
5. You're ready to go!

---

## 💡 Note

- This server receives live data from the Chrome extension.
- Make sure the extension is running and tracking a match on [play.autodarts.io](https://play.autodarts.io).

---

## 📁 Folder Structure

```
server/
├── public/
│   └── overlay.html
├── server.js
├── package.json
```

---

## 🧑‍💻 License

MIT – Free to use and modify.

