var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "20mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/extract-biodata", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", textPrompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in server environment."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemPrompt = `You are an expert Marathi & English BioData / Matrimony document OCR parser for Maharashtra Vanjari Matrimonial profiles.
Analyze the provided BioData image, photo, or document text and extract all details accurately into JSON.

Rules:
1. Extract Marathi or English text seamlessly.
2. If gender is not explicitly mentioned, infer from context (e.g. "\u0935\u0930 / \u092E\u0941\u0932\u0917\u093E" -> groom, "\u0935\u0927\u0942 / \u092E\u0941\u0932\u0917\u0940" -> bride). Default to "groom" or "bride".
3. Extract names, dates (formatted as YYYY-MM-DD if possible or readable format), time of birth, places, caste (subcaste: \u0935\u0902\u091C\u093E\u0930\u0940 / NT-D), gotra, rashi, nakshatra, height, education, occupation, income, father/mother name & occupation, brothers/sisters, relative surnames (e.g. Mundhe, Sanap, Nagre, Kakad, Ghuge, etc.), mama name & place, contact numbers, email, addresses.
4. Photo Detection Rule: Check if the provided image contains a personal photo/portrait of the candidate (girl/bride or boy/groom). Set "hasCandidatePhoto": true if a person's photo is present/visible in the document image, otherwise false. Provide a brief Marathi description in "candidatePhotoDescription" (e.g. "\u0935\u0927\u0942\u091A\u093E (\u092E\u0941\u0932\u0940\u091A\u093E) \u092B\u094B\u091F\u094B \u0938\u093E\u092A\u0921\u0932\u093E" or "\u0935\u0930\u093E\u091A\u093E (\u092E\u0941\u0932\u093E\u091A\u093E) \u092B\u094B\u091F\u094B \u0938\u093E\u092A\u0921\u0932\u093E").
5. If a field is missing, return empty string or null or appropriate default.
6. Provide clean Marathi or English strings for fields as requested.

Extract into this exact JSON structure:
{
  "fullName": "string",
  "gender": "bride" | "groom",
  "hasCandidatePhoto": boolean,
  "candidatePhotoDescription": "string",
  "dob": "YYYY-MM-DD or string",
  "birthTime": "string",
  "birthPlace": "string",
  "caste": "string",
  "subCaste": "string",
  "gotra": "string",
  "rashi": "string",
  "nakshatra": "string",
  "gan": "string",
  "nadi": "string",
  "height": "string",
  "weight": "string",
  "bloodGroup": "string",
  "complexion": "string",
  "education": "string",
  "occupation": "string",
  "companyName": "string",
  "income": "string",
  "maritalStatus": "never_married" | "divorced" | "widowed",
  "fatherName": "string",
  "fatherOccupation": "string",
  "motherName": "string",
  "motherOccupation": "string",
  "brothers": number,
  "brotherDetails": "string",
  "sisters": number,
  "sisterDetails": "string",
  "relativeSurnames": ["string"],
  "mamaName": "string",
  "mamaNative": "string",
  "mobile": "string",
  "email": "string",
  "currentAddress": "string",
  "nativeAddress": "string",
  "district": "string",
  "taluka": "string",
  "city": "string",
  "expectations": "string",
  "rawSummary": "string"
}`;
      let contentsPayload;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contentsPayload = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType
              }
            },
            {
              text: textPrompt || "Please extract all matrimony bio-data fields from this image document into JSON format."
            }
          ]
        };
      } else if (textPrompt) {
        contentsPayload = {
          parts: [{ text: textPrompt }]
        };
      } else {
        return res.status(400).json({ error: "Either imageBase64 or textPrompt is required" });
      }
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentsPayload,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);
      return res.json({
        success: true,
        extractedData: parsedData
      });
    } catch (error) {
      console.error("Error extracting BioData via Gemini:", error);
      return res.status(500).json({
        error: "Failed to extract BioData: " + (error.message || "Unknown error")
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
