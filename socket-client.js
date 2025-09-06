const { io } = require("socket.io-client");

// connect to your backend API (change port if you changed in .env)
const socket = io("http://localhost:4000");

socket.on("connect", () => console.log("connected", socket.id));

// listen for listing events
socket.on("listing:created", (d) => console.log("created", d));
socket.on("listing:updated", (d) => console.log("updated", d));
socket.on("listing:deleted", (d) => console.log("deleted", d));
