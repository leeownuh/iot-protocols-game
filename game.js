let level = 1;
let packetPos = { x: 0, y: 0 };
let visitedProtocols = [];
let currentGrid = [];

const protocolData = {
  MQTT: "MQTT is used for lightweight messaging in constrained devices.",
  CoAP: "CoAP is designed for simple electronics to communicate using HTTP-like requests.",
  AMQP: "AMQP is suitable for enterprise-level message brokering systems.",
  DDS: "DDS supports high-performance real-time communication.",
  LoRaWAN: "LoRaWAN is used for long-range, low-power communication.",
  Zigbee: "Zigbee is a low-power protocol used for personal area networks.",
  HTTP: "HTTP is used for web-based RESTful communication in IoT.",
  XMPP: "XMPP enables real-time messaging, useful in connected devices.",
  "6LoWPAN": "6LoWPAN adapts IPv6 for low-power and lossy networks.",
  BLE: "Bluetooth Low Energy is great for short-range communication in IoT.",
  Thread: "Thread provides secure, mesh-based communication for smart homes.",
  "NB-IoT": "NB-IoT is optimized for low power wide area network communication."
};

const levels = {
  1: {
    systemType: "Constrained Devices / Lightweight Messaging",
    grid: [
      ["packet", "", "", "MQTT", ""],
      ["", "", "CoAP", "", ""],
      ["", "", "", "", "AMQP"],
      ["", "", "", "", ""],
      ["", "", "", "", "goal"]
    ]
  },
  2: {
    systemType: "Industrial & Long-range Communication",
    grid: [
      ["packet", "", "DDS", "", ""],
      ["", "", "", "", ""],
      ["", "LoRaWAN", "", "", ""],
      ["", "", "", "Zigbee", ""],
      ["", "", "", "", "goal"]
    ]
  },
  3: {
    systemType: "Web, Messaging & Low-power Networks",
    grid: [
      ["packet", "", "HTTP", "", ""],
      ["", "", "", "", "XMPP"],
      ["", "", "", "", ""],
      ["", "", "6LoWPAN", "", ""],
      ["", "", "", "", "goal"]
    ]
  },
  4: {
    systemType: "Home Automation & Cellular IoT",
    grid: [
      ["packet", "", "", "BLE", ""],
      ["", "Thread", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", "NB-IoT"],
      ["", "", "", "", "goal"]
    ]
  }
};


function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  currentGrid = JSON.parse(JSON.stringify(levels[level].grid));
  document.getElementById("level-number").textContent = level;

  // 🆕 Set the system type heading
  document.getElementById("system-type-heading").textContent =
    "System Type: " + levels[level].systemType;

  for (let y = 0; y < currentGrid.length; y++) {
    for (let x = 0; x < currentGrid[y].length; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      let value = currentGrid[y][x];
      if (packetPos.x === x && packetPos.y === y) {
        const packet = document.createElement("div");
        packet.className = "packet";
        cell.appendChild(packet);
      } else if (value === "goal") {
        cell.classList.add("goal");
        cell.textContent = "🏁";
      } else if (value && protocolData[value]) {
        const proto = document.createElement("div");
        proto.className = "protocol";
        proto.textContent = value;
        cell.appendChild(proto);
      }

      grid.appendChild(cell);
    }
  }
}


function move(dir) {
  let { x, y } = packetPos;
  if (dir === "up" && y > 0) y--;
  else if (dir === "down" && y < 4) y++;
  else if (dir === "left" && x > 0) x--;
  else if (dir === "right" && x < 4) x++;

  packetPos = { x, y };

  const currentCell = levels[level].grid[y][x];
  if (protocolData[currentCell] && !visitedProtocols.includes(currentCell)) {
    visitedProtocols.push(currentCell);
    document.getElementById("info-box").textContent = protocolData[currentCell];
  }

  if (currentCell === "goal" && visitedProtocols.length >= 3) {
    document.getElementById("info-box").textContent = "🎉 Level Completed!";
    document.getElementById("next-level").style.display = "inline-block";
  }

  renderGrid();
}

function nextLevel() {
  level++;
  if (!levels[level]) {
    alert("🏁 All levels completed!");
    return;
  }
  packetPos = { x: 0, y: 0 };
  visitedProtocols = [];
  document.getElementById("info-box").textContent = "";
  document.getElementById("next-level").style.display = "none";
  renderGrid();
}

renderGrid();
