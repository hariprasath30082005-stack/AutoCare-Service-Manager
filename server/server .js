
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "orders.json");

function readOrders() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveOrders(orders) {
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
}

app.get("/", (req, res) => {
  res.json({ message: "Homemade Bakery API Running" });
});

app.get("/api/orders", (req, res) => {
  res.json(readOrders());
});

app.post("/api/orders", (req, res) => {
  const { name, phone, address, items } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !/^[0-9]{10}$/.test(phone) ||
    typeof address !== "string" ||
    !address.trim() ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message: "Valid customer details and items are required"
    });
  }

  const order = {
    id: Date.now().toString(),
    name: name.trim(),
    phone,
    address: address.trim(),
    items,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  const orders = readOrders();
  orders.push(order);
  saveOrders(orders);

  res.status(201).json({
    message: "Order saved successfully",
    order
  });
});

app.listen(PORT, () => {
  console.log(`Bakery backend running at http://localhost:${PORT}`);
});
