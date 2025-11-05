import express from "express";
import bodyParser from "body-parser";
import sharp from "sharp";

const app = express();
app.use(bodyParser.json({ limit: "25mb" }));

// Route: Convert image to RGBA PNG
app.post("/convert", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).send("Missing imageBase64");

    const buffer = Buffer.from(imageBase64, "base64");
    const rgbaBuffer = await sharp(buffer)
      .ensureAlpha()
      .png()
      .toBuffer();

    res.json({
      success: true,
      convertedBase64: rgbaBuffer.toString("base64"),
      mimeType: "image/png",
      fileName: "converted_rgba.png",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ RGBA Converter API running on ${PORT}`));
