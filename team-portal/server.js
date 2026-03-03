import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.post("/upload", async (req, res) => {
  try {
    console.log("Upload request received");

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzO0Hz6Nfa3DY6_OEE0EF1s0QwY0KJOcsIfmnKtxbQ6PHiahIALBDCMUaRW8CALzOMcjA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();
    console.log("Response from Apps Script:", text);

    res.send(text);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});