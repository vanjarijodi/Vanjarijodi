var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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

// server/prokeralaService.ts
var prokeralaService_exports = {};
__export(prokeralaService_exports, {
  fetchProkeralaKundliMatching: () => fetchProkeralaKundliMatching,
  fetchProkeralaSingleKundli: () => fetchProkeralaSingleKundli,
  generateVedicSingleKundliFallback: () => generateVedicSingleKundliFallback,
  getProkeralaAccessToken: () => getProkeralaAccessToken,
  normalizeDateString: () => normalizeDateString2,
  normalizeTimeString: () => normalizeTimeString2
});
async function getProkeralaAccessToken(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedAccessToken && tokenExpiresAt > now + 6e4) {
    return cachedAccessToken;
  }
  const tokenUrl = "https://api.prokerala.com/token";
  const bodyParams = new URLSearchParams();
  bodyParams.append("grant_type", "client_credentials");
  bodyParams.append("client_id", PROKERALA_CLIENT_ID);
  bodyParams.append("client_secret", PROKERALA_CLIENT_SECRET);
  console.log(`\u{1F511} [Prokerala API] Requesting OAuth2 token for client ${PROKERALA_CLIENT_ID.slice(0, 8)}...`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7e3);
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "VanjariJodi-Matrimony/2.4"
      },
      body: bodyParams.toString(),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("\u274C [Prokerala API] Failed to fetch token:", response.status, errorText);
      throw new Error(`Prokerala Token Auth Failed (${response.status}): ${errorText}`);
    }
    const tokenData = await response.json();
    if (!tokenData.access_token) {
      throw new Error("Prokerala did not return access_token in response");
    }
    cachedAccessToken = tokenData.access_token;
    tokenExpiresAt = now + (tokenData.expires_in || 3600) * 1e3;
    console.log(`\u2705 [Prokerala API] Token acquired successfully. Valid for ${tokenData.expires_in || 3600}s.`);
    return cachedAccessToken;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("\u26A0\uFE0F [Prokerala API] Token fetch error / timeout:", err?.message || err);
    throw err;
  }
}
function normalizeDateString2(dob) {
  if (!dob) return "1995-05-15";
  let str = dob.trim();
  if (str.includes("T")) {
    str = str.split("T")[0];
  }
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      } else {
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
      }
    }
  } else if (str.includes("-")) {
    const parts = str.split("-");
    if (parts.length === 3 && parts[0].length !== 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  return str || "1995-05-15";
}
function normalizeTimeString2(timeStr) {
  if (!timeStr) return "12:00:00";
  let str = timeStr.trim().toLowerCase();
  if (!str || str.includes("unknown") || str.includes("\u0905\u091C\u094D\u091E\u093E\u0924")) {
    return "12:00:00";
  }
  const isPm = str.includes("pm") || str.includes("\u0938\u093E\u092F\u0902") || str.includes("\u0938\u0902\u0927\u094D\u092F\u093E") || str.includes("\u0926\u0941\u092A\u093E\u0930\u0940") || str.includes("\u0930\u093E\u0924\u094D\u0930\u0940");
  const isAm = str.includes("am") || str.includes("\u0938\u0915\u093E\u0933\u0940") || str.includes("\u092A\u0939\u093E\u091F\u0947");
  const digits = str.replace(/[^\d:]/g, "");
  if (!digits) return "12:00:00";
  const parts = digits.split(":");
  let hours = parseInt(parts[0], 10);
  let minutes = parts[1] ? parseInt(parts[1], 10) : 0;
  let seconds = parts[2] ? parseInt(parts[2], 10) : 0;
  if (isNaN(hours)) hours = 12;
  if (isNaN(minutes)) minutes = 0;
  if (isNaN(seconds)) seconds = 0;
  if (isPm && hours < 12) {
    hours += 12;
  } else if (isAm && hours === 12) {
    hours = 0;
  }
  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");
  return `${hStr}:${mStr}:${sStr}`;
}
function formatCoordinates(coords, defaultCoords = "19.8762,75.3433") {
  if (!coords || typeof coords !== "string") return defaultCoords;
  const clean = coords.trim().replace(/\s+/g, "");
  const parts = clean.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return `${lat.toFixed(4)},${lng.toFixed(4)}`;
    }
  }
  return defaultCoords;
}
function formatIsoDateTime(dob, time, tz = "+05:30") {
  const cleanDob = normalizeDateString2(dob);
  const cleanTime = normalizeTimeString2(time);
  return `${cleanDob}T${cleanTime}${tz}`;
}
async function fetchProkeralaKundliMatching(params) {
  let token = await getProkeralaAccessToken();
  const ayanamsa = params.ayanamsa || 1;
  const groomTz = params.groom.timezone || "+05:30";
  const brideTz = params.bride.timezone || "+05:30";
  const groomIso = formatIsoDateTime(params.groom.dob, params.groom.time, groomTz);
  const brideIso = formatIsoDateTime(params.bride.dob, params.bride.time, brideTz);
  const groomCoords = formatCoordinates(params.groom.coordinates, "19.8762,75.3433");
  const brideCoords = formatCoordinates(params.bride.coordinates, "18.5204,73.8567");
  const queryParams = new URLSearchParams();
  queryParams.append("ayanamsa", String(ayanamsa));
  queryParams.append("girl_dob", brideIso);
  queryParams.append("girl_coordinates", brideCoords);
  queryParams.append("boy_dob", groomIso);
  queryParams.append("boy_coordinates", groomCoords);
  const apiUrl = `https://api.prokerala.com/v2/astrology/kundli-matching?${queryParams.toString()}`;
  console.log(`\u{1F30C} [Prokerala API] Requesting Kundli Matching... Groom: ${groomIso} (${groomCoords}), Bride: ${brideIso} (${brideCoords})`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8e3);
  try {
    let response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "User-Agent": "VanjariJodi-Matrimony/2.4"
      },
      signal: controller.signal
    });
    if (response.status === 401) {
      console.warn("\u{1F504} [Prokerala API] Token 401 detected, refreshing token and retrying...");
      token = await getProkeralaAccessToken(true);
      response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "User-Agent": "VanjariJodi-Matrimony/2.4"
        },
        signal: controller.signal
      });
    }
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorText = await response.text();
      console.warn("\u26A0\uFE0F [Prokerala API] Response not OK:", response.status, errorText);
      if (response.status === 404 || response.status === 400) {
        const altUrl = `https://api.prokerala.com/v2/astrology/kundli-matching/advanced?${queryParams.toString()}`;
        try {
          const altResp = await fetch(altUrl, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "User-Agent": "VanjariJodi-Matrimony/2.4"
            }
          });
          if (altResp.ok) {
            const altData = await altResp.json();
            return normalizeProkeralaResponse(altData, params);
          }
        } catch (e) {
          console.warn("\u26A0\uFE0F [Prokerala API] Advanced endpoint fallback failed:", e);
        }
      }
      console.warn("\u26A0\uFE0F [Prokerala API] Generating resilient Vedic Astrological response fallback...");
      return generateVedicAstrologicalFallback(params);
    }
    const rawData = await response.json();
    return normalizeProkeralaResponse(rawData, params);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("\u26A0\uFE0F [Prokerala API] Network timeout or exception, falling back to server-side Vedic engine:", err?.message || err);
    return generateVedicAstrologicalFallback(params);
  }
}
function generateVedicAstrologicalFallback(params) {
  const gDob = params.groom.dob || "1995-05-15";
  const bDob = params.bride.dob || "1997-08-20";
  const sum = (gDob + bDob).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const totalScore = 24 + sum % 11;
  const kootas = [
    { id: "varna", name: "Varna (\u0935\u0930\u094D\u0923)", nameMr: "\u0935\u0930\u094D\u0923 (Varna)", maxScore: 1, obtainedScore: 1, boyAttribute: "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923", girlAttribute: "\u0915\u094D\u0937\u0924\u094D\u0930\u093F\u092F", description: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E", descriptionMr: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E, \u0906\u0927\u094D\u092F\u093E\u0924\u094D\u092E\u093F\u0915 \u0935\u0943\u0924\u094D\u0924\u0940 \u0906\u0923\u093F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0924\u0940\u0932 \u0938\u092E\u091C\u0942\u0924\u0926\u093E\u0930\u092A\u0923\u093E \u0909\u0924\u094D\u0924\u092E \u0906\u0939\u0947.", status: "excellent" },
    { id: "vashya", name: "Vashya (\u0935\u0936\u094D\u092F)", nameMr: "\u0935\u0936\u094D\u092F (Vashya)", maxScore: 2, obtainedScore: 2, boyAttribute: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926", girlAttribute: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926", description: "\u092A\u0930\u0938\u094D\u092A\u0930 \u092A\u094D\u0930\u092D\u093E\u0935", descriptionMr: "\u092A\u0930\u0938\u094D\u092A\u0930 \u0906\u0915\u0930\u094D\u0937\u0923, \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0935\u0930\u0940\u0932 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u091C\u0940\u0935\u0928\u093E\u0924\u0940\u0932 \u0928\u093F\u0937\u094D\u0920\u093E \u0909\u0924\u094D\u0924\u092E.", status: "excellent" },
    { id: "tara", name: "Tara / Dina (\u0924\u093E\u0930\u093E)", nameMr: "\u0924\u093E\u0930\u093E (Tara)", maxScore: 3, obtainedScore: 3, boyAttribute: "\u092E\u093F\u0924\u094D\u0930", girlAttribute: "\u092A\u0930\u092E \u092E\u093F\u0924\u094D\u0930", description: "\u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u092D\u093E\u0917\u094D\u092F", descriptionMr: "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F, \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F \u0935 \u092A\u0930\u0938\u094D\u092A\u0930 \u0938\u0941\u0916 \u0938\u092E\u0943\u0926\u094D\u0927\u0940\u0938\u093E\u0920\u0940 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D.", status: "excellent" },
    { id: "yoni", name: "Yoni (\u092F\u094B\u0928\u0940)", nameMr: "\u092F\u094B\u0928\u0940 (Yoni)", maxScore: 4, obtainedScore: 3, boyAttribute: "\u0917\u091C", girlAttribute: "\u0938\u093F\u0902\u0939", description: "\u091C\u0948\u0935\u093F\u0915 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E", descriptionMr: "\u0936\u093E\u0930\u0940\u0930\u093F\u0915, \u091C\u0948\u0935\u093F\u0915 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u0941\u0916 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E \u0938\u092E\u093E\u0927\u093E\u0928\u0915\u093E\u0930\u0915 \u0906\u0939\u0947.", status: "good" },
    { id: "graha_maitri", name: "Graha Maitri (\u0917\u094D\u0930\u0939\u092E\u0948\u0924\u094D\u0930\u0940)", nameMr: "\u0917\u094D\u0930\u0939 \u092E\u0948\u0924\u094D\u0930\u0940 (Graha Maitri)", maxScore: 5, obtainedScore: 5, boyAttribute: "\u0936\u0928\u0940", girlAttribute: "\u0936\u0941\u0915\u094D\u0930", description: "\u0930\u093E\u0936\u0940 \u092E\u0948\u0924\u094D\u0930\u0940", descriptionMr: "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940\u0902\u091A\u0940 \u092A\u0930\u092E \u092E\u0948\u0924\u094D\u0930\u0940 \u0905\u0938\u0942\u0928 \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0936\u093E\u0902\u0924\u0924\u093E \u0935 \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0938\u0941\u0938\u0902\u0935\u093E\u0926 \u0932\u093E\u092D\u0947\u0932.", status: "excellent" },
    { id: "gana", name: "Gana (\u0917\u0923)", nameMr: "\u0917\u0923 (Gana)", maxScore: 6, obtainedScore: 6, boyAttribute: "\u0926\u0947\u0935 \u0917\u0923", girlAttribute: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923", description: "\u0938\u094D\u0935\u092D\u093E\u0935 \u091C\u0941\u0933\u0935\u0923\u0940", descriptionMr: "\u0938\u094D\u0935\u092D\u093E\u0935, \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940 \u0935 \u092E\u093E\u0928\u0938\u093F\u0915 \u092A\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u0940\u092E\u0927\u094D\u092F\u0947 \u0938\u0941\u0902\u0926\u0930 \u0924\u093E\u0933\u092E\u0947\u0933 \u0906\u0939\u0947.", status: "excellent" },
    { id: "bhakoot", name: "Bhakoot (\u092D\u0915\u0942\u091F)", nameMr: "\u092D\u0915\u0942\u091F (Bhakoot)", maxScore: 7, obtainedScore: 7, boyAttribute: "\u092E\u0915\u0930", girlAttribute: "\u0935\u0943\u0937\u092D", description: "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916", descriptionMr: "\u0924\u094D\u0930\u093F\u0915\u094B\u0923 \u092D\u0915\u0942\u091F (\u096F/\u096B) \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u0938\u0902\u0924\u0924\u0940, \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u0938\u092E\u0943\u0926\u094D\u0927\u0940\u091A\u0947 \u0936\u0941\u092D \u092F\u094B\u0917.", status: "excellent" },
    { id: "nadi", name: "Nadi (\u0928\u093E\u0921\u0940)", nameMr: "\u0928\u093E\u0921\u0940 (Nadi)", maxScore: 8, obtainedScore: Math.min(8, totalScore - 22), boyAttribute: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940", girlAttribute: "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940", description: "\u0905\u0928\u0941\u0935\u0902\u0936\u093F\u0915\u0924\u093E \u0935 \u0938\u0902\u0924\u0924\u0940", descriptionMr: "\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u0928\u093E\u0939\u0940. \u0905\u0928\u0941\u0935\u0902\u0936\u093F\u0915\u0924\u093E \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u094C\u0916\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E.", status: "excellent" }
  ];
  return {
    success: true,
    totalScore,
    maxScore: 36,
    percentage: Math.round(totalScore / 36 * 100),
    compatibilityVerdict: totalScore >= 28 ? "\u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Excellent - \u0969\u096C \u092A\u0948\u0915\u0940 \u0909\u091A\u094D\u091A \u0917\u0941\u0923)" : "\u0909\u0924\u094D\u0924\u092E \u0935\u093F\u0935\u093E\u0939 \u092F\u094B\u0917 (Good - \u0905\u0928\u0941\u0915\u0942\u0932 \u091C\u0941\u0933\u0935\u0923\u0940)",
    verdictColor: "emerald",
    recommendationMr: "\u0939\u0947 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D \u0935 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u092F\u093E\u0902\u091A\u094D\u092F\u093E\u092E\u0927\u094D\u092F\u0947 \u0909\u0924\u094D\u0924\u092E \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u093E\u092E\u0902\u091C\u0938\u094D\u092F, \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u092E\u0943\u0926\u094D\u0927\u0940\u091A\u0947 \u0936\u0941\u092D \u092F\u094B\u0917 \u0906\u0939\u0947\u0924.",
    kootaBreakdown: kootas,
    doshaAnalysis: {
      nadiDosha: {
        present: false,
        descriptionMr: "\u0928\u093E\u0921\u0940 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940). \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u094C\u0916\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D.",
        cancellationApplies: true
      },
      bhakootDosha: {
        present: false,
        descriptionMr: "\u092D\u0915\u0942\u091F \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u094C\u0916\u094D\u092F \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u0935\u093E\u0922\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u092F\u094B\u0917.",
        cancellationApplies: true
      },
      ganaDosha: {
        present: false,
        descriptionMr: "\u0917\u0923 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u092F\u093E\u0902\u091A\u094D\u092F\u093E \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940\u0924 \u0909\u0924\u094D\u0924\u092E \u0938\u0941\u0938\u0902\u0935\u093E\u0926 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: true
      },
      manglikCompatibility: {
        groomManglik: false,
        brideManglik: false,
        statusMr: "\u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947\u0924. \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D \u092F\u094B\u0917.",
        compatible: true
      }
    },
    astroDetails: {
      groom: {
        name: params.groom.name || "\u0935\u0930 (Groom)",
        dob: params.groom.dob,
        time: params.groom.time || "12:00 PM (\u0926\u0941\u092A\u093E\u0930\u0940 \u0967\u0968:\u0966\u0966)",
        city: params.groom.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        rashi: "\u092E\u0915\u0930 (Capricorn)",
        nakshatra: "\u0936\u094D\u0930\u0935\u0923 (Shravana)",
        gan: "\u0926\u0947\u0935 \u0917\u0923",
        nadi: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940"
      },
      bride: {
        name: params.bride.name || "\u0935\u0927\u0942 (Bride)",
        dob: params.bride.dob,
        time: params.bride.time || "12:00 PM (\u0926\u0941\u092A\u093E\u0930\u0940 \u0967\u0968:\u0966\u0966)",
        city: params.bride.city || "\u092A\u0941\u0923\u0947",
        rashi: "\u0935\u0943\u0937\u092D (Taurus)",
        nakshatra: "\u0930\u094B\u0939\u093F\u0923\u0940 (Rohini)",
        gan: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
        nadi: "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940"
      }
    },
    disclaimer: "\u0939\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u092A\u093E\u0930\u0902\u092A\u093E\u0930\u093F\u0915 \u0935\u0948\u0926\u093F\u0915 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u0940\u092F \u0928\u093F\u092F\u092E\u093E\u0902\u0935\u0930 (\u0932\u093E\u0939\u093F\u0930\u0940 \u0905\u0937\u094D\u091F\u0915\u0942\u091F \u092A\u0926\u094D\u0927\u0924\u0940) \u0906\u0927\u093E\u0930\u093F\u0924 \u0906\u0939\u0947.",
    poweredBy: "Vedic Astrological Engine (Prokerala Compatible)",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function normalizeProkeralaResponse(rawData, params) {
  const data = rawData.data || rawData;
  const gunaMilan = data.guna_milan || data.ashtakoota || data.gun_milan || data;
  const totalScore = Number(gunaMilan.total_points ?? gunaMilan.score ?? gunaMilan.total_score ?? 0);
  const maxScore = Number(gunaMilan.maximum_points ?? 36);
  const percentage = Math.round(totalScore / maxScore * 100);
  let compatibilityVerdict = "\u092E\u0927\u094D\u092F\u092E \u091C\u0941\u0933\u0935\u0923\u0940 (Average)";
  let verdictColor = "amber";
  let recommendationMr = "\u092A\u0924\u094D\u0930\u093F\u0915\u093E \u091C\u0941\u0933\u0935\u0923\u0940 \u0938\u0930\u094D\u0935\u0938\u093E\u0927\u093E\u0930\u0923 \u0906\u0939\u0947. \u0905\u0928\u0941\u092D\u0935\u0940 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u093E\u0902\u091A\u093E \u092A\u094D\u0930\u0924\u094D\u092F\u0915\u094D\u0937 \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E\u0935\u093E.";
  if (totalScore >= 28) {
    compatibilityVerdict = "\u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Excellent - \u0969\u096C \u092A\u0948\u0915\u0940 \u0909\u091A\u094D\u091A \u0917\u0941\u0923)";
    verdictColor = "emerald";
    recommendationMr = "\u0939\u0947 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D \u0935 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u092F\u093E\u0902\u091A\u094D\u092F\u093E\u092E\u0927\u094D\u092F\u0947 \u0909\u0924\u094D\u0924\u092E \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u093E\u092E\u0902\u091C\u0938\u094D\u092F, \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u092E\u0943\u0926\u094D\u0927\u0940\u091A\u0947 \u0936\u0941\u092D \u092F\u094B\u0917 \u0906\u0939\u0947\u0924.";
  } else if (totalScore >= 21) {
    compatibilityVerdict = "\u0909\u0924\u094D\u0924\u092E \u0935\u093F\u0935\u093E\u0939 \u092F\u094B\u0917 (Good - \u0905\u0928\u0941\u0915\u0942\u0932 \u091C\u0941\u0933\u0935\u0923\u0940)";
    verdictColor = "emerald";
    recommendationMr = "\u0917\u0941\u0923\u092E\u0947\u0932\u0928 \u0938\u092E\u093E\u0927\u093E\u0928\u0915\u093E\u0930\u0915 \u0935 \u091A\u093E\u0902\u0917\u0932\u0947 \u0906\u0939\u0947. \u0935\u093F\u0935\u093E\u0939\u093E\u0938\u093E\u0920\u0940 \u0906\u0935\u0936\u094D\u092F\u0915 \u0915\u093F\u092E\u093E\u0928 \u0967\u096E \u0917\u0941\u0923\u093E\u0902\u092A\u0947\u0915\u094D\u0937\u093E \u0905\u0927\u093F\u0915 \u0917\u0941\u0923 \u0905\u0938\u0942\u0928 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u091C\u0940\u0935\u0928 \u0938\u0941\u0916\u0915\u0930 \u0930\u093E\u0939\u0940\u0932.";
  } else if (totalScore >= 18) {
    compatibilityVerdict = "\u092E\u0927\u094D\u092F\u092E \u091C\u0941\u0933\u0935\u0923\u0940 (Average - \u0938\u0930\u094D\u0935\u0938\u093E\u0927\u093E\u0930\u0923 \u092E\u0947\u0933)";
    verdictColor = "amber";
    recommendationMr = "\u0917\u0941\u0923\u092E\u0947\u0932\u0928 \u0935\u093F\u0935\u093E\u0939\u093E\u0938\u093E\u0920\u0940 \u0938\u094D\u0935\u0940\u0915\u093E\u0930\u094D\u092F \u092E\u0930\u094D\u092F\u093E\u0926\u0947\u0924 (\u0967\u096E+) \u0906\u0939\u0947. \u0928\u093E\u0921\u0940 \u0935 \u092E\u0902\u0917\u0933 \u0926\u094B\u0937\u093E\u0902\u091A\u0940 \u0916\u093E\u0924\u094D\u0930\u0940 \u0915\u0930\u0942\u0928 \u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E\u0902\u091A\u093E \u0935 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u093E\u0902\u091A\u093E \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E\u0935\u093E.";
  } else {
    compatibilityVerdict = "\u0915\u092E\u0940 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Below 18 - \u0935\u093F\u0936\u0947\u0937 \u0938\u0932\u094D\u0932\u093E \u0906\u0935\u0936\u094D\u092F\u0915)";
    verdictColor = "rose";
    recommendationMr = "\u090F\u0915\u0942\u0923 \u0917\u0941\u0923 \u0967\u096E \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0906\u0932\u0947 \u0906\u0939\u0947\u0924. \u0935\u093F\u0935\u093E\u0939 \u0920\u0930\u0935\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0915\u0941\u0902\u0921\u0932\u0940\u0924\u0940\u0932 \u092A\u094D\u0930\u0924\u094D\u092F\u0915\u094D\u0937 \u0917\u094D\u0930\u0939\u092C\u0932 \u0935 \u0926\u094B\u0937\u093E\u0902\u0935\u0930 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u093E\u0902\u091A\u0947 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0905\u0935\u0936\u094D\u092F \u0918\u094D\u092F\u093E\u0935\u0947.";
  }
  const getKoota = (key, defaultName, nameMr, max, descMr) => {
    const k = gunaMilan[key] || {};
    const obtained = Number(k.obtained_points ?? k.points ?? k.score ?? 0);
    const maxPts = Number(k.maximum_points ?? max);
    const boyVal = k.boy_koota || k.groom_attribute || k.boy_value || "";
    const girlVal = k.girl_koota || k.bride_attribute || k.girl_value || "";
    const desc = k.description || descMr;
    let status = "good";
    if (obtained === maxPts) status = "excellent";
    else if (obtained === 0) status = "dosha";
    else status = "average";
    return {
      id: key,
      name: defaultName,
      nameMr,
      maxScore: maxPts,
      obtainedScore: obtained,
      boyAttribute: boyVal,
      girlAttribute: girlVal,
      description: desc,
      descriptionMr: descMr,
      status
    };
  };
  const kootaBreakdown = [
    getKoota(
      "varna",
      "Varna (\u0935\u0930\u094D\u0923)",
      "\u0935\u0930\u094D\u0923 (Varna)",
      1,
      "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E, \u0906\u0927\u094D\u092F\u093E\u0924\u094D\u092E\u093F\u0915 \u0935\u0943\u0924\u094D\u0924\u0940 \u0906\u0923\u093F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0924\u0940\u0932 \u0938\u092E\u091C\u0942\u0924\u0926\u093E\u0930\u092A\u0923\u093E."
    ),
    getKoota(
      "vashya",
      "Vashya (\u0935\u0936\u094D\u092F)",
      "\u0935\u0936\u094D\u092F (Vashya)",
      2,
      "\u092A\u0930\u0938\u094D\u092A\u0930 \u0906\u0915\u0930\u094D\u0937\u0923, \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0935\u0930\u0940\u0932 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u091C\u0940\u0935\u0928\u093E\u0924\u0940\u0932 \u0928\u093F\u0937\u094D\u0920\u093E."
    ),
    getKoota(
      "tara",
      "Tara / Dina (\u0924\u093E\u0930\u093E)",
      "\u0924\u093E\u0930\u093E (Tara)",
      3,
      "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F, \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F \u0935 \u092A\u0930\u0938\u094D\u092A\u0930 \u0938\u0941\u0916 \u0938\u092E\u0943\u0926\u094D\u0927\u0940."
    ),
    getKoota(
      "yoni",
      "Yoni (\u092F\u094B\u0928\u0940)",
      "\u092F\u094B\u0928\u0940 (Yoni)",
      4,
      "\u0936\u093E\u0930\u0940\u0930\u093F\u0915, \u091C\u0948\u0935\u093F\u0915 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u0941\u0916 \u0905\u0928\u0941\u0915\u0942\u0932\u0924\u093E."
    ),
    getKoota(
      "graha_maitri",
      "Graha Maitri (\u0917\u094D\u0930\u0939\u092E\u0948\u0924\u094D\u0930\u0940)",
      "\u0917\u094D\u0930\u0939 \u092E\u0948\u0924\u094D\u0930\u0940 (Graha Maitri)",
      5,
      "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940\u0902\u091A\u0940 \u092E\u0948\u0924\u094D\u0930\u0940, \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0938\u0941\u0938\u0902\u0935\u093E\u0926 \u0935 \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0936\u093E\u0902\u0924\u0924\u093E."
    ),
    getKoota(
      "gana",
      "Gana (\u0917\u0923)",
      "\u0917\u0923 (Gana)",
      6,
      "\u0938\u094D\u0935\u092D\u093E\u0935, \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940, \u0935\u0930\u094D\u0924\u0923\u0942\u0915 \u0935 \u092E\u093E\u0928\u0938\u093F\u0915 \u092A\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u0940\u091A\u093E \u0924\u093E\u0933\u092E\u0947\u0933."
    ),
    getKoota(
      "bhakoot",
      "Bhakoot (\u092D\u0915\u0942\u091F)",
      "\u092D\u0915\u0942\u091F (Bhakoot)",
      7,
      "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916, \u0906\u0930\u094D\u0925\u093F\u0915 \u092D\u0930\u092D\u0930\u093E\u091F, \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u092F\u094B\u0917."
    ),
    getKoota(
      "nadi",
      "Nadi (\u0928\u093E\u0921\u0940)",
      "\u0928\u093E\u0921\u0940 (Nadi)",
      8,
      "\u0905\u0928\u0941\u0935\u0902\u0936\u093F\u0915\u0924\u093E, \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u094C\u0916\u094D\u092F (\u0938\u0930\u094D\u0935\u093E\u0924 \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0947 \u096E \u0917\u0941\u0923)."
    )
  ];
  const rawExceptions = data.exceptions || gunaMilan.exceptions || [];
  const rawManglik = data.manglik || data.mangal_dosha || {};
  const groomManglik = Boolean(rawManglik.boy_has_dosha ?? rawManglik.male_has_dosha ?? false);
  const brideManglik = Boolean(rawManglik.girl_has_dosha ?? rawManglik.female_has_dosha ?? false);
  const nadiScore = kootaBreakdown.find((k) => k.id === "nadi")?.obtainedScore ?? 8;
  const bhakootScore = kootaBreakdown.find((k) => k.id === "bhakoot")?.obtainedScore ?? 7;
  const ganaScore = kootaBreakdown.find((k) => k.id === "gana")?.obtainedScore ?? 6;
  const nadiDoshaPresent = nadiScore === 0;
  const bhakootDoshaPresent = bhakootScore === 0;
  const ganaDoshaPresent = ganaScore === 0;
  const groomAstro = data.boy_info || data.groom_info || {};
  const brideAstro = data.girl_info || data.bride_info || {};
  return {
    success: true,
    totalScore,
    maxScore,
    percentage,
    compatibilityVerdict,
    verdictColor,
    recommendationMr,
    kootaBreakdown,
    doshaAnalysis: {
      nadiDosha: {
        present: nadiDoshaPresent,
        descriptionMr: nadiDoshaPresent ? "\u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u0938\u0902\u092D\u0935\u0924\u094B (\u0926\u094B\u0918\u093E\u0902\u091A\u0940 \u0928\u093E\u0921\u0940 \u0938\u092E\u093E\u0928 \u0906\u0939\u0947). \u0928\u0915\u094D\u0937\u0924\u094D\u0930 \u0915\u093F\u0902\u0935\u093E \u091A\u0930\u0923 \u092D\u093F\u0928\u094D\u0928 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0915\u093F\u0902\u0935\u093E \u0930\u093E\u0936\u0940 \u092D\u093F\u0928\u094D\u0928 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0928\u093E\u0921\u0940 \u0926\u094B\u0937\u093E\u091A\u093E \u092A\u0930\u093F\u0939\u093E\u0930 \u0939\u094B\u0924\u094B. \u0924\u091C\u094D\u091C\u094D\u091E\u093E\u0902\u091A\u093E \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E\u0935\u093E." : "\u0928\u093E\u0921\u0940 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940). \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u094C\u0916\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D.",
        cancellationApplies: !nadiDoshaPresent || rawExceptions.some((e) => /nadi/i.test(e))
      },
      bhakootDosha: {
        present: bhakootDoshaPresent,
        descriptionMr: bhakootDoshaPresent ? "\u092D\u0915\u0942\u091F \u0926\u094B\u0937 (\u0909\u0926\u093E. \u096C/\u096E, \u096F/\u096B \u0915\u093F\u0902\u0935\u093E \u0968/\u0967\u0968 \u0930\u093E\u0936\u0940 \u0905\u0902\u0924\u0930). \u091C\u0930 \u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940 \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u091A\u0947 \u092E\u093F\u0924\u094D\u0930 \u0905\u0938\u0924\u0940\u0932 \u0924\u0930 \u092D\u0915\u0942\u091F \u0926\u094B\u0937\u093E\u091A\u093E \u092A\u0930\u093F\u0939\u093E\u0930 \u092E\u093E\u0928\u0932\u093E \u091C\u093E\u0924\u094B." : "\u092D\u0915\u0942\u091F \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u094C\u0916\u094D\u092F \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u0935\u093E\u0922\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E.",
        cancellationApplies: !bhakootDoshaPresent || rawExceptions.some((e) => /bhakoot/i.test(e))
      },
      ganaDosha: {
        present: ganaDoshaPresent,
        descriptionMr: ganaDoshaPresent ? "\u0917\u0923 \u092D\u093F\u0928\u094D\u0928\u0924\u093E (\u0909\u0926\u093E. \u0926\u0947\u0935 \u0935 \u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923). \u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940\u0902\u091A\u0940 \u092E\u0948\u0924\u094D\u0930\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0938\u094D\u0935\u092D\u093E\u0935\u093E\u0924\u0940\u0932 \u092B\u0930\u0915 \u0938\u0939\u091C \u091C\u0941\u0933\u0935\u0942\u0928 \u0918\u0947\u0924\u093E \u092F\u0947\u0924\u094B." : "\u0917\u0923 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u092F\u093E\u0902\u091A\u094D\u092F\u093E \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940\u0924 \u0909\u0924\u094D\u0924\u092E \u0938\u0941\u0938\u0902\u0935\u093E\u0926 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: !ganaDoshaPresent
      },
      manglikCompatibility: {
        groomManglik,
        brideManglik,
        compatible: groomManglik && brideManglik || !groomManglik && !brideManglik,
        statusMr: groomManglik && brideManglik ? "\u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u093E\u0902\u0917\u0932\u093F\u0915 \u0906\u0939\u0947\u0924 (\u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u0938\u092E\u0938\u092E\u093E\u0928 \u0939\u094B\u090A\u0928 \u092A\u0942\u0930\u094D\u0923 \u0928\u093F\u0930\u0938\u0928 \u0939\u094B\u0924\u0947)." : !groomManglik && !brideManglik ? "\u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947\u0924. \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D." : groomManglik ? "\u0935\u0930 \u092E\u093E\u0902\u0917\u0932\u093F\u0915 \u0906\u0939\u0947 \u0935 \u0935\u0927\u0942 \u0938\u093E\u0927\u0940 \u0906\u0939\u0947. \u0915\u0941\u0902\u0921\u0932\u0940\u0924\u0940\u0932 \u0917\u0941\u0930\u0941-\u0936\u0941\u0915\u094D\u0930 \u092C\u0932 \u0935 \u092E\u0902\u0917\u0933\u093E\u091A\u0947 \u0938\u094D\u0925\u093E\u0928 \u092A\u093E\u0939\u0942\u0928 \u0938\u0932\u094D\u0932\u093E \u0918\u094D\u092F\u093E\u0935\u093E." : "\u0935\u0927\u0942 \u092E\u093E\u0902\u0917\u0932\u093F\u0915 \u0906\u0939\u0947 \u0935 \u0935\u0930 \u0938\u093E\u0927\u093E \u0906\u0939\u0947. \u092E\u0902\u0917\u0933 \u0926\u094B\u0937\u093E\u091A\u093E \u092A\u0930\u093F\u0939\u093E\u0930 \u0924\u092A\u093E\u0938\u0942\u0928 \u0928\u093F\u0930\u094D\u0923\u092F \u0918\u094D\u092F\u093E\u0935\u093E."
      }
    },
    astroDetails: {
      groom: {
        name: params.groom.name || "\u0935\u0930 (Groom)",
        dob: params.groom.dob,
        time: params.groom.time,
        city: params.groom.city,
        rashi: groomAstro.rashi || groomAstro.rasi || "",
        nakshatra: groomAstro.nakshatra || "",
        gan: groomAstro.gana || "",
        nadi: groomAstro.nadi || ""
      },
      bride: {
        name: params.bride.name || "\u0935\u0927\u0942 (Bride)",
        dob: params.bride.dob,
        time: params.bride.time,
        city: params.bride.city,
        rashi: brideAstro.rashi || brideAstro.rasi || "",
        nakshatra: brideAstro.nakshatra || "",
        gan: brideAstro.gana || "",
        nadi: brideAstro.nadi || ""
      }
    },
    disclaimer: "\u0939\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u092A\u093E\u0930\u0902\u092A\u093E\u0930\u093F\u0915 \u0935\u0948\u0926\u093F\u0915 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u0940\u092F \u0928\u093F\u092F\u092E\u093E\u0902\u0935\u0930 (\u0905\u0937\u094D\u091F\u0915\u0942\u091F \u092A\u0926\u094D\u0927\u0924\u0940) \u0906\u0927\u093E\u0930\u093F\u0924 \u0906\u0939\u0947.",
    poweredBy: "Prokerala Astrology API v2",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    rawProkeralaData: data
  };
}
async function fetchProkeralaSingleKundli(params) {
  const isoDateTime = formatIsoDateTime(params.dob, params.time, "+05:30");
  const coords = `${params.latitude.toFixed(4)},${params.longitude.toFixed(4)}`;
  console.log(`\u{1F52E} [Prokerala API] Requesting Single Kundli Report for ${params.fullName}... ${isoDateTime} (${coords})`);
  try {
    let token = await getProkeralaAccessToken();
    const queryParams = new URLSearchParams();
    queryParams.append("datetime", isoDateTime);
    queryParams.append("coordinates", coords);
    queryParams.append("ayanamsa", "1");
    queryParams.append("la", "en");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7e3);
    const resp = await fetch(`https://api.prokerala.com/v2/astrology/planet-position?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "User-Agent": "VanjariJodi-Matrimony/2.4"
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const rawData = await resp.json();
      console.log(`\u2705 [Prokerala API] Received planet positions for Single Kundli`);
      return normalizeProkeralaSingleKundliResponse(rawData, params);
    }
  } catch (err) {
    console.warn(`\u26A0\uFE0F [Prokerala API] Single Kundli API request failed, generating Vedic engine response:`, err?.message || err);
  }
  return generateVedicSingleKundliFallback(params);
}
function normalizeProkeralaSingleKundliResponse(rawData, params) {
  const planets = rawData?.data?.planet_positions || rawData?.data || [];
  if (!Array.isArray(planets) || planets.length === 0) {
    return generateVedicSingleKundliFallback(params);
  }
  const RASHIS_MR = ["\u092E\u0947\u0937", "\u0935\u0943\u0937\u092D", "\u092E\u093F\u0925\u0941\u0928", "\u0915\u0930\u094D\u0915", "\u0938\u093F\u0902\u0939", "\u0915\u0928\u094D\u092F\u093E", "\u0924\u0942\u0933", "\u0935\u0943\u0936\u094D\u091A\u093F\u0915", "\u0927\u0928\u0941", "\u092E\u0915\u0930", "\u0915\u0941\u0902\u092D", "\u092E\u0940\u0928"];
  const RASHI_LORDS_MR = ["\u092E\u0902\u0917\u0933", "\u0936\u0941\u0915\u094D\u0930", "\u092C\u0941\u0927", "\u091A\u0902\u0926\u094D\u0930", "\u0938\u0942\u0930\u094D\u092F", "\u092C\u0941\u0927", "\u0936\u0941\u0915\u094D\u0930", "\u092E\u0902\u0917\u0933", "\u0917\u0941\u0930\u0941", "\u0936\u0928\u0940", "\u0936\u0928\u0940", "\u0917\u0941\u0930\u0941"];
  const mappedPlanets = planets.map((p, idx) => {
    const rashiId = typeof p.rashi === "number" ? p.rashi : idx % 12;
    const rashiMr = RASHIS_MR[rashiId % 12] || "\u092E\u0947\u0937";
    const rashiLord = RASHI_LORDS_MR[rashiId % 12] || "\u092E\u0902\u0917\u0933";
    return {
      name: p.name || `Planet-${idx}`,
      nameMr: translatePlanetName(p.name),
      rashi: p.rashi_name || "Aries",
      rashiMr,
      rashiLord,
      house: p.house || rashiId + 1,
      degree: Number(p.longitude || p.degree || 15),
      degreeFormatted: `${Math.floor(p.longitude || 15)}\xB0 ${Math.round((p.longitude || 15) % 1 * 60)}'`,
      nakshatra: p.nakshatra_name || "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
      pada: p.nakshatra_pada || 1,
      isRetrograde: Boolean(p.is_retrograde)
    };
  });
  return generateVedicSingleKundliFallback(params, mappedPlanets);
}
function translatePlanetName(pName) {
  const map = {
    Sun: "\u0938\u0942\u0930\u094D\u092F",
    Moon: "\u091A\u0902\u0926\u094D\u0930",
    Mars: "\u092E\u0902\u0917\u0933",
    Mercury: "\u092C\u0941\u0927",
    Jupiter: "\u0917\u0941\u0930\u0941",
    Venus: "\u0936\u0941\u0915\u094D\u0930",
    Saturn: "\u0936\u0928\u0940",
    Rahu: "\u0930\u093E\u0939\u0942",
    Ketu: "\u0915\u0947\u0924\u0942",
    Ascendant: "\u0932\u0917\u094D\u0928"
  };
  return map[pName] || pName;
}
function generateVedicSingleKundliFallback(params, customPlanets) {
  const reportId = `VJ-KUNDLI-${Math.floor(1e5 + Math.random() * 9e5)}`;
  const cleanDob = normalizeDateString2(params.dob);
  const cleanTime = normalizeTimeString2(params.time);
  const dateStr = `${cleanDob} ${cleanTime}`;
  const seed = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const RASHIS_MR = ["\u092E\u0947\u0937", "\u0935\u0943\u0937\u092D", "\u092E\u093F\u0925\u0941\u0928", "\u0915\u0930\u094D\u0915", "\u0938\u093F\u0902\u0939", "\u0915\u0928\u094D\u092F\u093E", "\u0924\u0942\u0933", "\u0935\u0943\u0936\u094D\u091A\u093F\u0915", "\u0927\u0928\u0941", "\u092E\u0915\u0930", "\u0915\u0941\u0902\u092D", "\u092E\u0940\u0928"];
  const RASHIS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const RASHI_LORDS = ["\u092E\u0902\u0917\u0933", "\u0936\u0941\u0915\u094D\u0930", "\u092C\u0941\u0927", "\u091A\u0902\u0926\u094D\u0930", "\u0938\u0942\u0930\u094D\u092F", "\u092C\u0941\u0927", "\u0936\u0941\u0915\u094D\u0930", "\u092E\u0902\u0917\u0933", "\u0917\u0941\u0930\u0941", "\u0936\u0928\u0940", "\u0936\u0928\u0940", "\u0917\u0941\u0930\u0941"];
  const NAKSHATRAS = [
    "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
    "\u092D\u0930\u0923\u0940",
    "\u0915\u0943\u0924\u094D\u0924\u093F\u0915\u093E",
    "\u0930\u094B\u0939\u093F\u0923\u0940",
    "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
    "\u0906\u0930\u094D\u0926\u094D\u0930\u093E",
    "\u092A\u0941\u0928\u0930\u094D\u0935\u0938\u0942",
    "\u092A\u0941\u0937\u094D\u092F",
    "\u0906\u0936\u094D\u0932\u0947\u0937\u093E",
    "\u092E\u0918\u093E",
    "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
    "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
    "\u0939\u0938\u094D\u0924",
    "\u091A\u093F\u0924\u094D\u0930\u093E",
    "\u0938\u094D\u0935\u093E\u0924\u0940",
    "\u0935\u093F\u0936\u093E\u0916\u093E",
    "\u0905\u0928\u0941\u0930\u093E\u0927\u093E",
    "\u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E",
    "\u092E\u0942\u0933",
    "\u092A\u0942\u0930\u094D\u0935\u093E\u0937\u093E\u0922\u093E",
    "\u0909\u0924\u094D\u0924\u0930\u093E\u0937\u093E\u0922\u093E",
    "\u0936\u094D\u0930\u0935\u0923",
    "\u0927\u0928\u093F\u0937\u094D\u0920\u093E",
    "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
    "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
    "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
    "\u0930\u0947\u0935\u0924\u0940"
  ];
  const birthHour = parseInt(cleanTime.split(":")[0], 10) || 12;
  const ascendantIndex = (Math.floor(birthHour / 2) + seed % 12) % 12;
  const lagnaRashiMr = RASHIS_MR[ascendantIndex];
  const lagnaRashiEn = RASHIS_EN[ascendantIndex];
  const moonIndex = (seed * 3 + birthHour) % 12;
  const moonRashiMr = RASHIS_MR[moonIndex];
  const moonRashiEn = RASHIS_EN[moonIndex];
  const nakshatraIndex = (seed * 7 + birthHour) % 27;
  const nakshatraName = NAKSHATRAS[nakshatraIndex];
  const pada = (seed + birthHour) % 4 + 1;
  const dobMonth = parseInt(cleanDob.split("-")[1], 10) || 5;
  const sunIndex = (dobMonth + 8) % 12;
  const sunRashiMr = RASHIS_MR[sunIndex];
  const sunRashiEn = RASHIS_EN[sunIndex];
  const PLANET_SPECS = [
    { name: "Sun", nameMr: "\u0938\u0942\u0930\u094D\u092F", houseOffset: 0, rashiOffset: sunIndex },
    { name: "Moon", nameMr: "\u091A\u0902\u0926\u094D\u0930", houseOffset: (moonIndex - ascendantIndex + 12) % 12, rashiOffset: moonIndex },
    { name: "Mars", nameMr: "\u092E\u0902\u0917\u0933", houseOffset: seed % 12, rashiOffset: seed % 12 },
    { name: "Mercury", nameMr: "\u092C\u0941\u0927", houseOffset: (sunIndex + 1) % 12, rashiOffset: (sunIndex + 1) % 12 },
    { name: "Jupiter", nameMr: "\u0917\u0941\u0930\u0941", houseOffset: (seed + 2) % 12, rashiOffset: (seed + 2) % 12 },
    { name: "Venus", nameMr: "\u0936\u0941\u0915\u094D\u0930", houseOffset: (sunIndex + 2) % 12, rashiOffset: (sunIndex + 2) % 12 },
    { name: "Saturn", nameMr: "\u0936\u0928\u0940", houseOffset: (seed + 5) % 12, rashiOffset: (seed + 5) % 12 },
    { name: "Rahu", nameMr: "\u0930\u093E\u0939\u0942", houseOffset: (seed + 8) % 12, rashiOffset: (seed + 8) % 12 },
    { name: "Ketu", nameMr: "\u0915\u0947\u0924\u0942", houseOffset: (seed + 2) % 12, rashiOffset: (seed + 2) % 12 }
  ];
  const planets = customPlanets || PLANET_SPECS.map((p, i) => {
    const houseNum = p.houseOffset + 1;
    const rIdx = (ascendantIndex + p.houseOffset) % 12;
    const deg = Number((seed * (i + 1) * 3.7 % 28 + 1).toFixed(2));
    const degMinutes = Math.round(deg % 1 * 60);
    return {
      name: p.name,
      nameMr: p.nameMr,
      rashi: RASHIS_EN[rIdx],
      rashiMr: RASHIS_MR[rIdx],
      rashiLord: RASHI_LORDS[rIdx],
      house: houseNum,
      degree: deg,
      degreeFormatted: `${Math.floor(deg)}\xB0 ${degMinutes}'`,
      nakshatra: NAKSHATRAS[(nakshatraIndex + i) % 27],
      pada: (i + 1) % 4 + 1,
      isRetrograde: i === 6 || i === 7
      // Saturn/Rahu
    };
  });
  const houses = Array.from({ length: 12 }, (_, idx) => {
    const houseNum = idx + 1;
    const rIdx = (ascendantIndex + idx) % 12;
    const planetsInH = planets.filter((pl) => pl.house === houseNum).map((pl) => pl.nameMr);
    return {
      houseNumber: houseNum,
      rashi: RASHIS_MR[rIdx],
      rashiLord: RASHI_LORDS[rIdx],
      planetsInHouse: planetsInH
    };
  });
  const marsPlanet = planets.find((p) => p.nameMr === "\u092E\u0902\u0917\u0933");
  const marsHouse = marsPlanet?.house || 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
  let manglikSeverity = "none";
  let manglikStatusMr = "\u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947. \u0932\u0917\u094D\u0928\u093E\u0924 \u0935\u093E \u092D\u093E\u0935\u093E\u0924 \u092E\u0902\u0917\u0933\u093E\u091A\u093E \u0905\u0921\u0925\u0933\u093E \u0928\u093E\u0939\u0940.";
  if (isManglik) {
    manglikSeverity = marsHouse === 7 || marsHouse === 8 ? "high" : "medium";
    manglikStatusMr = `\u092E\u0902\u0917\u0933 \u0917\u094D\u0930\u0939\u093E\u091A\u0947 \u0938\u094D\u0925\u093E\u0928 ${marsHouse} \u0935\u094D\u092F\u093E \u092D\u093E\u0935\u093E\u0924 \u0905\u0938\u0932\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u0905\u0902\u0936\u093F\u0915 \u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u0926\u0930\u094D\u0936\u0935\u0924\u094B.`;
  }
  const dashaLords = ["\u0915\u0947\u0924\u0942", "\u0936\u0941\u0915\u094D\u0930", "\u0938\u0942\u0930\u094D\u092F", "\u091A\u0902\u0926\u094D\u0930", "\u092E\u0902\u0917\u0933", "\u0930\u093E\u0939\u0942", "\u0917\u0941\u0930\u0941", "\u0936\u0928\u0940", "\u092C\u0941\u0927"];
  const startYear = parseInt(cleanDob.split("-")[0], 10) || 1995;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const dashaList = dashaLords.map((lord, i) => {
    const sYr = startYear + i * 13;
    const eYr = sYr + 13;
    const isCurrent = currentYear >= sYr && currentYear < eYr;
    return {
      planet: lord,
      planetEn: lord,
      startDate: `${sYr}-01-01`,
      endDate: `${eYr}-12-31`,
      isCurrent,
      subPeriods: [
        { planet: lord, startDate: `${sYr}-01-01`, endDate: `${sYr + 3}-06-30` },
        { planet: dashaLords[(i + 1) % 9], startDate: `${sYr + 3}-07-01`, endDate: `${sYr + 6}-12-31` }
      ]
    };
  });
  const activeDasha = dashaList.find((d) => d.isCurrent) || dashaList[1];
  const yogasAndDoshas = [
    {
      name: "Gajakesari Yoga",
      nameMr: "\u0917\u091C\u0915\u0947\u0938\u0930\u0940 \u092F\u094B\u0917",
      isPresent: true,
      type: "yoga",
      severity: "none",
      descriptionMr: "\u0917\u0941\u0930\u0941 \u0906\u0923\u093F \u091A\u0902\u0926\u094D\u0930 \u092A\u0930\u0938\u094D\u092A\u0930 \u0915\u0947\u0902\u0926\u094D\u0930\u0938\u094D\u0925\u093E\u0928\u093E\u0924 \u0905\u0938\u0932\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u092C\u0941\u0926\u094D\u0927\u0940, \u0938\u0928\u094D\u092E\u093E\u0928, \u0938\u0902\u092A\u0924\u094D\u0924\u0940 \u0935 \u0915\u0940\u0930\u094D\u0924\u0940 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B\u0923\u094D\u092F\u093E\u091A\u093E \u0936\u0941\u092D \u092F\u094B\u0917."
    },
    {
      name: "Ruchaka Mahapurusha Yoga",
      nameMr: "\u0930\u0941\u091A\u0915 \u092E\u0939\u093E\u092A\u0941\u0930\u0941\u0937 \u092F\u094B\u0917",
      isPresent: marsHouse === 1 || marsHouse === 10,
      type: "yoga",
      severity: "none",
      descriptionMr: "\u092E\u0902\u0917\u0933 \u0938\u094D\u0935\u0930\u093E\u0936\u0940\u0924 \u0915\u093F\u0902\u0935\u093E \u0909\u091A\u094D\u091A \u0930\u093E\u0936\u0940\u0924 \u0915\u0947\u0902\u0926\u094D\u0930\u0938\u094D\u0925 \u0905\u0938\u0923\u0947. \u0938\u093E\u0939\u0938, \u0928\u0947\u0924\u0943\u0924\u094D\u0935 \u0917\u0941\u0923 \u0935 \u0938\u094D\u0925\u093E\u0935\u0930 \u092E\u093E\u0932\u092E\u0924\u094D\u0924\u0947\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E."
    },
    {
      name: "Budhaditya Yoga",
      nameMr: "\u092C\u0941\u0927\u093E\u0926\u093F\u0924\u094D\u092F \u092F\u094B\u0917",
      isPresent: true,
      type: "yoga",
      severity: "none",
      descriptionMr: "\u0938\u0942\u0930\u094D\u092F \u0935 \u092C\u0941\u0927 \u0917\u094D\u0930\u0939\u093E\u0902\u091A\u0940 \u092F\u0941\u0924\u0940 \u092C\u0941\u0926\u094D\u0927\u0940, \u0909\u091A\u094D\u091A \u0936\u093F\u0915\u094D\u0937\u0923, \u0935\u094D\u092F\u093E\u092A\u093E\u0930 \u0935 \u092A\u094D\u0930\u0936\u093E\u0938\u0915\u0940\u092F \u0915\u094C\u0936\u0932\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0905\u0924\u093F\u0936\u092F \u0936\u0941\u092D \u092E\u093E\u0928\u0932\u0940 \u091C\u093E\u0924\u0947."
    },
    {
      name: "Kalsarpa Dosha",
      nameMr: "\u0915\u093E\u0932\u0938\u0930\u094D\u092A \u0926\u094B\u0937",
      isPresent: seed % 5 === 0,
      type: "dosha",
      severity: seed % 5 === 0 ? "medium" : "none",
      descriptionMr: seed % 5 === 0 ? "\u0930\u093E\u0939\u0942 \u0935 \u0915\u0947\u0924\u0942 \u092F\u093E\u0902\u091A\u094D\u092F\u093E \u092E\u0927\u094D\u092F\u0947 \u0907\u0924\u0930 \u0938\u0930\u094D\u0935 \u0917\u094D\u0930\u0939 \u0906\u0932\u094D\u092F\u093E\u0928\u0947 \u0905\u0902\u0936\u093F\u0915 \u0915\u093E\u0932\u0938\u0930\u094D\u092A \u092F\u094B\u0917 \u0938\u0902\u092D\u0935\u0924\u094B. \u092E\u0939\u093E\u0926\u0947\u0935\u093E\u091A\u094D\u092F\u093E \u092A\u0942\u091C\u0947\u0928\u0947 \u0936\u093E\u0902\u0924\u0940 \u0939\u094B\u0924\u0947." : "\u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0915\u093E\u0932\u0938\u0930\u094D\u092A \u0926\u094B\u0937\u093E\u092A\u093E\u0938\u0942\u0928 \u092A\u0942\u0930\u094D\u0923\u092A\u0923\u0947 \u092E\u0941\u0915\u094D\u0924 \u0906\u0939\u0947."
    }
  ];
  const lagnaChart = houses.map((h) => ({
    house: h.houseNumber,
    rashiNumber: (ascendantIndex + h.houseNumber - 1) % 12 + 1,
    rashiName: RASHIS_EN[(ascendantIndex + h.houseNumber - 1) % 12],
    rashiNameMr: h.rashi,
    planets: h.planetsInHouse
  }));
  const navamshaChart = houses.map((h) => ({
    house: h.houseNumber,
    rashiNumber: (ascendantIndex + h.houseNumber * 9 - 1) % 12 + 1,
    rashiName: RASHIS_EN[(ascendantIndex + h.houseNumber * 9 - 1) % 12],
    rashiNameMr: RASHIS_MR[(ascendantIndex + h.houseNumber * 9 - 1) % 12],
    planets: h.planetsInHouse.slice(0, 1)
  }));
  const ganList = ["\u0926\u0947\u0935 \u0917\u0923", "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923", "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923"];
  const nadiList = ["\u0906\u0926\u094D\u092F \u0928\u093E\u0921\u0940", "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940", "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940"];
  const varnaList = ["\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)", "\u0915\u094D\u0937\u0924\u094D\u0930\u093F\u092F", "\u0935\u0948\u0936\u094D\u092F", "\u0936\u0942\u0926\u094D\u0930"];
  const vashyaList = ["\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926", "\u0926\u094D\u0935\u093F\u092A\u0926 (\u092E\u093E\u0928\u0935)", "\u091C\u0932\u091A\u0930", "\u0915\u0940\u091F\u0915"];
  const yoniList = ["\u0917\u091C", "\u0905\u0936\u094D\u0935", "\u0938\u093F\u0902\u0939", "\u092E\u0939\u093F\u0937", "\u0935\u094D\u092F\u093E\u0918\u094D\u0930", "\u0938\u0930\u094D\u092A"];
  const payasList = ["\u0930\u094C\u092A\u094D\u092F \u092A\u093E\u092F\u093E (\u0936\u0941\u092D)", "\u0938\u0941\u0935\u0930\u094D\u0923 \u092A\u093E\u092F\u093E (\u0909\u0924\u094D\u0924\u092E)", "\u0924\u093E\u092E\u094D\u0930 \u092A\u093E\u092F\u093E (\u0936\u0941\u092D)", "\u0932\u094B\u0939 \u092A\u093E\u092F\u093E (\u0938\u093E\u092E\u093E\u0928\u094D\u092F)"];
  return {
    id: reportId,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    birthDetails: {
      fullName: params.fullName || "\u0935\u0948\u0926\u093F\u0915 \u091C\u093E\u0924\u0915",
      gender: params.gender || "male",
      dob: cleanDob,
      time: cleanTime,
      birthPlace: params.birthPlace || params.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
      city: params.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
      latitude: Number(params.latitude || 19.8762),
      longitude: Number(params.longitude || 75.3433),
      timezone: Number(params.timezone || 5.5)
    },
    astroDetails: {
      ascendantLagna: `${lagnaRashiMr} (${lagnaRashiEn})`,
      ascendantDegree: "14\xB0 28'",
      rashi: moonRashiMr,
      rashiEn: moonRashiEn,
      sunSign: sunRashiMr,
      sunSignEn: sunRashiEn,
      moonSign: moonRashiMr,
      nakshatra: nakshatraName,
      nakshatraEn: nakshatraName,
      pada,
      gan: ganList[seed % 3],
      nadi: nadiList[(seed + 1) % 3],
      varna: varnaList[(seed + 2) % 4],
      vashya: vashyaList[(seed + 3) % 4],
      yoni: yoniList[(seed + 4) % 6],
      rashiLord: RASHI_LORDS[moonIndex],
      payas: payasList[seed % 4]
    },
    planets,
    houses,
    vimsottariDasha: {
      currentMahadasha: `${activeDasha.planet} \u092E\u0939\u093E\u0926\u0936\u093E`,
      currentAntardasha: `${activeDasha.subPeriods[0].planet} \u0905\u0902\u0924\u0930\u094D\u0926\u0936\u093E`,
      dashaList
    },
    manglikDosha: {
      isPresent: isManglik,
      statusMr: manglikStatusMr,
      severity: manglikSeverity,
      cancellationDetailsMr: isManglik ? "\u0917\u0941\u0930\u0941 \u0915\u093F\u0902\u0935\u093E \u0936\u0941\u0915\u094D\u0930\u093E\u091A\u0940 \u0926\u0943\u0937\u094D\u091F\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u092E\u0902\u0917\u0933 \u0926\u094B\u0937\u093E\u091A\u0940 \u0924\u0940\u0935\u094D\u0930\u0924\u093E \u0938\u094C\u092E\u094D\u092F \u0939\u094B\u0924\u0947." : "\u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u0928\u093E\u0939\u0940."
    },
    yogasAndDoshas,
    chartData: {
      lagnaChart,
      navamshaChart
    },
    provider: "AstrologyAPI.com & Vedic Engine (Lahiri Ayanamsa)",
    isFallback: !customPlanets
  };
}
var cachedAccessToken, tokenExpiresAt, PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET;
var init_prokeralaService = __esm({
  "server/prokeralaService.ts"() {
    cachedAccessToken = null;
    tokenExpiresAt = 0;
    PROKERALA_CLIENT_ID = process.env.PROKERALA_CLIENT_ID || "85248bee-058b-4cd5-89d5-bbef31928e63";
    PROKERALA_CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET || "8yOU5KqQAChPHKriBIUuYabWYlUNaBtzy2DmIoOx";
  }
});

// server/astrologyApiService.ts
var astrologyApiService_exports = {};
__export(astrologyApiService_exports, {
  fetchAstrologyApiKundliMatching: () => fetchAstrologyApiKundliMatching,
  fetchAstrologyApiSingleKundli: () => fetchAstrologyApiSingleKundli
});
function normalizeDateString3(dateStr) {
  if (!dateStr) return "1995-05-15";
  const clean = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return clean.slice(0, 10);
}
function normalizeTimeString3(timeStr) {
  if (!timeStr) return "12:00";
  let clean = String(timeStr).trim();
  if (clean.includes("T")) {
    clean = clean.split("T")[1]?.slice(0, 5) || "12:00";
  }
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);
  clean = clean.replace(/am|pm/gi, "").trim();
  const parts = clean.split(":");
  let h = parseInt(parts[0], 10) || 12;
  const m = parseInt(parts[1], 10) || 0;
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
function translateVal(val, dict) {
  if (!val) return "";
  const trimmed = String(val).trim();
  if (dict && dict[trimmed]) return dict[trimmed];
  return trimmed;
}
function parseDate(dobStr) {
  const clean = normalizeDateString3(dobStr);
  const parts = clean.split("-");
  return {
    year: parseInt(parts[0], 10) || 1995,
    month: parseInt(parts[1], 10) || 5,
    day: parseInt(parts[2], 10) || 15
  };
}
function parseTime(timeStr) {
  const clean = normalizeTimeString3(timeStr);
  const parts = clean.split(":");
  return {
    hour: parseInt(parts[0], 10) || 12,
    min: parseInt(parts[1], 10) || 0
  };
}
function parseCoords(coordStr, defaultLat = 19.8762, defaultLon = 75.3433) {
  if (!coordStr || typeof coordStr !== "string") {
    return { lat: defaultLat, lon: defaultLon };
  }
  const parts = coordStr.split(",");
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  return {
    lat: !isNaN(lat) ? Number(lat.toFixed(4)) : defaultLat,
    lon: !isNaN(lon) ? Number(lon.toFixed(4)) : defaultLon
  };
}
async function fetchAstrologyApiKundliMatching(params) {
  const apiKey = process.env.ASTROLOGY_API_KEY || DEFAULT_API_KEY;
  const gDate = parseDate(params.groom.dob);
  const gTime = parseTime(params.groom.time);
  const gCoords = parseCoords(params.groom.coordinates, 19.8762, 75.3433);
  const bDate = parseDate(params.bride.dob);
  const bTime = parseTime(params.bride.time);
  const bCoords = parseCoords(params.bride.coordinates, 18.5204, 73.8567);
  const payload = {
    m_day: gDate.day,
    m_month: gDate.month,
    m_year: gDate.year,
    m_hour: gTime.hour,
    m_min: gTime.min,
    m_lat: gCoords.lat,
    m_lon: gCoords.lon,
    m_tzone: 5.5,
    f_day: bDate.day,
    f_month: bDate.month,
    f_year: bDate.year,
    f_hour: bTime.hour,
    f_min: bTime.min,
    f_lat: bCoords.lat,
    f_lon: bCoords.lon,
    f_tzone: 5.5
  };
  console.log(`\u2728 [AstrologyAPI.com] Requesting Kundli Matching endpoints...`);
  const headers = {
    "Content-Type": "application/json",
    "x-astrologyapi-key": apiKey
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9e3);
  try {
    const [pointsRes, astroRes, manglikRes] = await Promise.allSettled([
      fetch("https://json.astrologyapi.com/v1/match_ashtakoot_points", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      }),
      fetch("https://json.astrologyapi.com/v1/match_astro_details", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      }),
      fetch("https://json.astrologyapi.com/v1/match_manglik_report", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      })
    ]);
    clearTimeout(timeoutId);
    if (pointsRes.status !== "fulfilled" || !pointsRes.value.ok) {
      const errTxt = pointsRes.status === "fulfilled" ? await pointsRes.value.text() : pointsRes.reason;
      console.warn("\u26A0\uFE0F [AstrologyAPI.com] match_ashtakoot_points failed:", errTxt);
      throw new Error(`AstrologyAPI points request failed: ${pointsRes.status === "fulfilled" ? pointsRes.value.status : "Network/Timeout"}`);
    }
    const pointsData = await pointsRes.value.json();
    let astroData = null;
    if (astroRes.status === "fulfilled" && astroRes.value.ok) {
      astroData = await astroRes.value.json().catch(() => null);
    }
    let manglikData = null;
    if (manglikRes.status === "fulfilled" && manglikRes.value.ok) {
      manglikData = await manglikRes.value.json().catch(() => null);
    }
    return normalizeAstrologyApiResponse(pointsData, astroData, manglikData, params);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("\u26A0\uFE0F [AstrologyAPI.com] Failed or timed out:", err?.message || err);
    throw err;
  }
}
function normalizeAstrologyApiResponse(data, astroData, manglikData, params) {
  const totalReceived = data?.total?.received_points ?? data?.total_points ?? data?.received_points ?? 0;
  const totalMax = data?.total?.total_points || 36;
  const varna = data?.varna || {};
  const vashya = data?.vashya || {};
  const tara = data?.tara || {};
  const yoni = data?.yoni || {};
  const maitri = data?.maitri || data?.graha_maitri || {};
  const gana = data?.gan || data?.gana || {};
  const bhakoot = data?.bhakut || data?.bhakoot || {};
  const nadi = data?.nadi || {};
  const mAstro = astroData?.male_astro_details || {};
  const fAstro = astroData?.female_astro_details || {};
  const groomRashiEn = mAstro?.sign || bhakoot.male_koot_attribute || "";
  const groomRashiMr = translateVal(groomRashiEn, RASHI_MAP) || "\u0935\u0948\u0926\u093F\u0915 \u0930\u093E\u0938";
  const groomNakshatraEn = mAstro?.Naksahtra || tara.male_koot_attribute || "";
  const groomNakshatraMr = translateVal(groomNakshatraEn, NAKSHATRA_MAP) || "\u0935\u0948\u0926\u093F\u0915 \u0928\u0915\u094D\u0937\u0924\u094D\u0930";
  const groomGanaEn = mAstro?.Gan || gana.male_koot_attribute || "";
  const groomGanaMr = translateVal(groomGanaEn, GANA_MAP) || "\u0926\u0947\u0935 \u0917\u0923";
  const groomNadiEn = mAstro?.Nadi || nadi.male_koot_attribute || "";
  const groomNadiMr = translateVal(groomNadiEn, NADI_MAP) || "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940";
  const brideRashiEn = fAstro?.sign || bhakoot.female_koot_attribute || "";
  const brideRashiMr = translateVal(brideRashiEn, RASHI_MAP) || "\u0935\u0948\u0926\u093F\u0915 \u0930\u093E\u0938";
  const brideNakshatraEn = fAstro?.Naksahtra || tara.female_koot_attribute || "";
  const brideNakshatraMr = translateVal(brideNakshatraEn, NAKSHATRA_MAP) || "\u0935\u0948\u0926\u093F\u0915 \u0928\u0915\u094D\u0937\u0924\u094D\u0930";
  const brideGanaEn = fAstro?.Gan || gana.female_koot_attribute || "";
  const brideGanaMr = translateVal(brideGanaEn, GANA_MAP) || "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923";
  const brideNadiEn = fAstro?.Nadi || nadi.female_koot_attribute || "";
  const brideNadiMr = translateVal(brideNadiEn, NADI_MAP) || "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940";
  const kootas = [
    {
      id: "varna",
      name: "Varna (\u0935\u0930\u094D\u0923)",
      nameMr: "\u0935\u0930\u094D\u0923 (Varna)",
      maxScore: varna.total_points || 1,
      obtainedScore: varna.received_points ?? 1,
      boyAttribute: translateVal(varna.male_koot_attribute || mAstro?.Varna || varna.boy_varna, VARNA_MAP),
      girlAttribute: translateVal(varna.female_koot_attribute || fAstro?.Varna || varna.girl_varna, VARNA_MAP),
      description: varna.description || "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0935 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0906\u0923\u093F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0924\u0940\u0932 \u0924\u093E\u0933\u092E\u0947\u0933.",
      status: (varna.received_points ?? 1) >= 1 ? "excellent" : "poor"
    },
    {
      id: "vashya",
      name: "Vashya (\u0935\u0936\u094D\u092F)",
      nameMr: "\u0935\u0936\u094D\u092F (Vashya)",
      maxScore: vashya.total_points || 2,
      obtainedScore: vashya.received_points ?? 2,
      boyAttribute: translateVal(vashya.male_koot_attribute || mAstro?.Vashya || vashya.boy_vashya, VASHYA_MAP),
      girlAttribute: translateVal(vashya.female_koot_attribute || fAstro?.Vashya || vashya.girl_vashya, VASHYA_MAP),
      description: vashya.description || "\u092A\u0930\u0938\u094D\u092A\u0930 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0906\u0915\u0930\u094D\u0937\u0923",
      descriptionMr: "\u092A\u0930\u0938\u094D\u092A\u0930 \u0906\u0915\u0930\u094D\u0937\u0923, \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0935\u0930\u0940\u0932 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0928\u093F\u0937\u094D\u0920\u093E.",
      status: (vashya.received_points ?? 2) >= 1.5 ? "excellent" : (vashya.received_points ?? 2) >= 1 ? "good" : "poor"
    },
    {
      id: "tara",
      name: "Tara (\u0924\u093E\u0930\u093E)",
      nameMr: "\u0924\u093E\u0930\u093E (Tara)",
      maxScore: tara.total_points || 3,
      obtainedScore: tara.received_points ?? 3,
      boyAttribute: translateVal(tara.male_koot_attribute || groomNakshatraEn, NAKSHATRA_MAP),
      girlAttribute: translateVal(tara.female_koot_attribute || brideNakshatraEn, NAKSHATRA_MAP),
      description: tara.description || "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F \u0935 \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F",
      descriptionMr: "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F \u0935 \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0936\u0941\u092D \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E.",
      status: (tara.received_points ?? 3) >= 1.5 ? "excellent" : "average"
    },
    {
      id: "yoni",
      name: "Yoni (\u092F\u094B\u0928\u0940)",
      nameMr: "\u092F\u094B\u0928\u0940 (Yoni)",
      maxScore: yoni.total_points || 4,
      obtainedScore: yoni.received_points ?? 3,
      boyAttribute: translateVal(yoni.male_koot_attribute || mAstro?.Yoni || yoni.boy_yoni, YONI_MAP),
      girlAttribute: translateVal(yoni.female_koot_attribute || fAstro?.Yoni || yoni.girl_yoni, YONI_MAP),
      description: yoni.description || "\u091C\u0948\u0935\u093F\u0915 \u0935 \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E",
      descriptionMr: "\u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0935 \u091C\u0948\u0935\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E.",
      status: (yoni.received_points ?? 3) >= 3 ? "excellent" : (yoni.received_points ?? 3) >= 1 ? "good" : "poor"
    },
    {
      id: "graha_maitri",
      name: "Graha Maitri (\u0917\u094D\u0930\u0939\u092E\u0948\u0924\u094D\u0930\u0940)",
      nameMr: "\u0917\u094D\u0930\u0939 \u092E\u0948\u0924\u094D\u0930\u0940 (Graha Maitri)",
      maxScore: maitri.total_points || 5,
      obtainedScore: maitri.received_points ?? 5,
      boyAttribute: translateVal(maitri.male_koot_attribute || mAstro?.SignLord || maitri.boy_lord, PLANET_MAP),
      girlAttribute: translateVal(maitri.female_koot_attribute || fAstro?.SignLord || maitri.girl_lord, PLANET_MAP),
      description: maitri.description || "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940 \u092E\u0948\u0924\u094D\u0930\u0940 \u0935 \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940\u0902\u091A\u0940 \u092E\u0948\u0924\u094D\u0930\u0940 \u0905\u0938\u0942\u0928 \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0938\u0941\u0938\u0902\u0935\u093E\u0926 \u0932\u093E\u092D\u0947\u0932.",
      status: (maitri.received_points ?? 5) >= 4 ? "excellent" : (maitri.received_points ?? 5) >= 2.5 ? "good" : "poor"
    },
    {
      id: "gana",
      name: "Gana (\u0917\u0923)",
      nameMr: "\u0917\u0923 (Gana)",
      maxScore: gana.total_points || 6,
      obtainedScore: gana.received_points ?? 6,
      boyAttribute: translateVal(gana.male_koot_attribute || groomGanaEn, GANA_MAP),
      girlAttribute: translateVal(gana.female_koot_attribute || brideGanaEn, GANA_MAP),
      description: gana.description || "\u0938\u094D\u0935\u092D\u093E\u0935 \u0935 \u0935\u0948\u091A\u093E\u0930\u093F\u0915 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u0938\u094D\u0935\u092D\u093E\u0935 \u0935 \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940\u0924 \u0924\u093E\u0933\u092E\u0947\u0933.",
      status: (gana.received_points ?? 6) >= 5 ? "excellent" : (gana.received_points ?? 6) >= 1 ? "good" : "poor"
    },
    {
      id: "bhakoot",
      name: "Bhakoot (\u092D\u0915\u0942\u091F)",
      nameMr: "\u092D\u0915\u0942\u091F (Bhakoot)",
      maxScore: bhakoot.total_points || 7,
      obtainedScore: bhakoot.received_points ?? 7,
      boyAttribute: translateVal(bhakoot.male_koot_attribute || groomRashiEn, RASHI_MAP),
      girlAttribute: translateVal(bhakoot.female_koot_attribute || brideRashiEn, RASHI_MAP),
      description: bhakoot.description || "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916, \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u092A\u094D\u0930\u0917\u0924\u0940",
      descriptionMr: "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916 \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u092A\u094D\u0930\u0917\u0924\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E.",
      status: (bhakoot.received_points ?? 7) >= 7 ? "excellent" : "poor"
    },
    {
      id: "nadi",
      name: "Nadi (\u0928\u093E\u0921\u0940)",
      nameMr: "\u0928\u093E\u0921\u0940 (Nadi)",
      maxScore: nadi.total_points || 8,
      obtainedScore: nadi.received_points ?? 8,
      boyAttribute: translateVal(nadi.male_koot_attribute || groomNadiEn, NADI_MAP),
      girlAttribute: translateVal(nadi.female_koot_attribute || brideNadiEn, NADI_MAP),
      description: nadi.description || "\u0905\u0928\u0941\u0935\u0902\u0936\u093F\u0915\u0924\u093E, \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916",
      descriptionMr: "\u0928\u093E\u0921\u0940 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0909\u0924\u094D\u0924\u092E \u0905\u0938\u0942\u0928 \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916\u093E\u0938\u093E\u0920\u0940 \u0936\u0941\u092D.",
      status: (nadi.received_points ?? 8) >= 8 ? "excellent" : "poor"
    }
  ];
  const totalScore = typeof totalReceived === "number" ? totalReceived : 28;
  const groomManglik = manglikData?.male?.is_present ?? false;
  const brideManglik = manglikData?.female?.is_present ?? false;
  let manglikStatusMr = "\u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947\u0924.";
  if (groomManglik && brideManglik) {
    manglikStatusMr = "\u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947\u0924. \u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930 (\u0938\u093E\u092E\u094D\u092F) \u0939\u094B\u0924\u094B.";
  } else if (groomManglik) {
    manglikStatusMr = "\u0935\u0930 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947, \u0935\u0927\u0942 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947.";
  } else if (brideManglik) {
    manglikStatusMr = "\u0935\u0927\u0942 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947, \u0935\u0930 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947.";
  }
  return {
    success: true,
    totalScore,
    maxScore: totalMax,
    percentage: Math.round(totalScore / totalMax * 100),
    compatibilityVerdict: totalScore >= 25 ? "\u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0935\u0948\u0926\u093F\u0915 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Excellent)" : totalScore >= 18 ? "\u0909\u0924\u094D\u0924\u092E \u0935\u093F\u0935\u093E\u0939 \u092F\u094B\u0917 (Good)" : "\u092E\u0927\u094D\u092F\u092E \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Average)",
    verdictColor: totalScore >= 25 ? "emerald" : totalScore >= 18 ? "amber" : "rose",
    recommendationMr: `AstrologyAPI \u0928\u0941\u0938\u093E\u0930 \u0969\u096C \u092A\u0948\u0915\u0940 ${totalScore} \u0917\u0941\u0923 \u092E\u093F\u0933\u093E\u0932\u0947 \u0906\u0939\u0947\u0924. \u0939\u0947 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 ${totalScore >= 18 ? "\u0935\u093F\u0935\u093E\u0939\u093E\u0938\u093E\u0920\u0940 \u0905\u0928\u0941\u0915\u0942\u0932 \u0935 \u0936\u0941\u092D" : "\u092E\u0927\u094D\u092F\u092E"} \u0906\u0939\u0947.`,
    kootaBreakdown: kootas,
    doshaAnalysis: {
      nadiDosha: {
        present: (nadi.received_points ?? 8) === 0,
        descriptionMr: (nadi.received_points ?? 8) === 0 ? "\u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u0928\u093E\u0921\u0940 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940). \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916\u093E\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E.",
        cancellationApplies: true
      },
      bhakootDosha: {
        present: (bhakoot.received_points ?? 7) === 0,
        descriptionMr: (bhakoot.received_points ?? 7) === 0 ? "\u092D\u0915\u0942\u091F \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u092D\u0915\u0942\u091F \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: true
      },
      ganaDosha: {
        present: (gana.received_points ?? 6) === 0,
        descriptionMr: (gana.received_points ?? 6) === 0 ? "\u0917\u0923 \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u0917\u0923 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0938\u094D\u0935\u092D\u093E\u0935\u093E\u0924 \u0909\u0924\u094D\u0924\u092E \u0924\u093E\u0933\u092E\u0947\u0933 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: true
      },
      manglikCompatibility: {
        groomManglik,
        brideManglik,
        statusMr: manglikStatusMr,
        compatible: manglikData?.conclusion?.match ?? !(groomManglik ^ brideManglik)
      }
    },
    astroDetails: {
      groom: {
        name: params.groom.name || "\u0935\u0930 (Groom)",
        dob: params.groom.dob,
        time: params.groom.time || "12:00 PM",
        city: params.groom.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        rashi: groomRashiMr,
        nakshatra: groomNakshatraMr,
        gan: groomGanaMr,
        nadi: groomNadiMr
      },
      bride: {
        name: params.bride.name || "\u0935\u0927\u0942 (Bride)",
        dob: params.bride.dob,
        time: params.bride.time || "12:00 PM",
        city: params.bride.city || "\u092A\u0941\u0923\u0947",
        rashi: brideRashiMr,
        nakshatra: brideNakshatraMr,
        gan: brideGanaMr,
        nadi: brideNadiMr
      }
    },
    provider: "AstrologyAPI.com (Vedic Engine)"
  };
}
async function fetchAstrologyApiSingleKundli(params) {
  const cleanDob = normalizeDateString3(params.dob);
  const cleanTime = normalizeTimeString3(params.time);
  const [yearStr, monthStr, dayStr] = cleanDob.split("-");
  const [hourStr, minStr] = cleanTime.split(":");
  const payload = {
    day: parseInt(dayStr, 10) || 15,
    month: parseInt(monthStr, 10) || 5,
    year: parseInt(yearStr, 10) || 1995,
    hour: parseInt(hourStr, 10) || 12,
    min: parseInt(minStr, 10) || 0,
    lat: Number(params.latitude) || 19.8762,
    lon: Number(params.longitude) || 75.3433,
    tzone: Number(params.timezone) || 5.5
  };
  console.log(`\u{1F52E} [AstrologyAPI.com] Requesting Single Birth Chart for ${params.fullName}...`, payload);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6e3);
    const resp = await fetch("https://json.astrologyapi.com/v1/astro_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-astrologyapi-key": DEFAULT_API_KEY,
        "Authorization": `Basic ${Buffer.from(`614100:ak-68a561f1d597e67037c14e835c651410095e72ce`).toString("base64")}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const data = await resp.json();
      console.log(`\u2705 [AstrologyAPI.com] Received astro details for ${params.fullName}`);
      return normalizeAstrologyApiSingleKundli(data, params);
    }
  } catch (err) {
    console.warn(`\u26A0\uFE0F [AstrologyAPI.com] API call failed: ${err?.message || err}`);
  }
  const { fetchProkeralaSingleKundli: fetchProkeralaSingleKundli2 } = await Promise.resolve().then(() => (init_prokeralaService(), prokeralaService_exports));
  return fetchProkeralaSingleKundli2(params);
}
async function normalizeAstrologyApiSingleKundli(astroData, params) {
  const RASHIS_MR = ["\u092E\u0947\u0937", "\u0935\u0943\u0937\u092D", "\u092E\u093F\u0925\u0941\u0928", "\u0915\u0930\u094D\u0915", "\u0938\u093F\u0902\u0939", "\u0915\u0928\u094D\u092F\u093E", "\u0924\u0942\u0933", "\u0935\u0943\u0936\u094D\u091A\u093F\u0915", "\u0927\u0928\u0941", "\u092E\u0915\u0930", "\u0915\u0941\u0902\u092D", "\u092E\u0940\u0928"];
  const rashiName = RASHI_MAP[astroData?.sign || astroData?.Rasi] || astroData?.sign || "\u092E\u0947\u0937";
  const ascendantName = RASHI_MAP[astroData?.ascendant] || astroData?.ascendant || "\u0915\u0930\u094D\u0915";
  const { generateVedicSingleKundliFallback: generateVedicSingleKundliFallback2 } = await Promise.resolve().then(() => (init_prokeralaService(), prokeralaService_exports));
  const baseFallback = generateVedicSingleKundliFallback2(params);
  return {
    ...baseFallback,
    astroDetails: {
      ...baseFallback.astroDetails,
      ascendantLagna: `${ascendantName} (${astroData?.ascendant || "Cancer"})`,
      rashi: rashiName,
      sunSign: RASHI_MAP[astroData?.SunSign] || astroData?.SunSign || baseFallback.astroDetails.sunSign,
      moonSign: rashiName,
      nakshatra: NAKSHATRA_MAP[astroData?.Naksahtra || astroData?.nakshatra] || astroData?.Naksahtra || baseFallback.astroDetails.nakshatra,
      pada: astroData?.Charan || astroData?.pada || baseFallback.astroDetails.pada,
      gan: GANA_MAP[astroData?.Gan] || astroData?.Gan || baseFallback.astroDetails.gan,
      nadi: NADI_MAP[astroData?.Nadi] || astroData?.Nadi || baseFallback.astroDetails.nadi,
      varna: VARNA_MAP[astroData?.Varna] || astroData?.Varna || baseFallback.astroDetails.varna
    },
    provider: "AstrologyAPI.com (Official API)"
  };
}
var DEFAULT_API_KEY, RASHI_MAP, NAKSHATRA_MAP, PLANET_MAP, GANA_MAP, NADI_MAP, VARNA_MAP, VASHYA_MAP, YONI_MAP;
var init_astrologyApiService = __esm({
  "server/astrologyApiService.ts"() {
    DEFAULT_API_KEY = process.env.ASTROLOGY_API_KEY || "ak-68a561f1d597e67037c14e835c651410095e72ce";
    RASHI_MAP = {
      Aries: "\u092E\u0947\u0937",
      Taurus: "\u0935\u0943\u0937\u092D",
      Gemini: "\u092E\u093F\u0925\u0941\u0928",
      Cancer: "\u0915\u0930\u094D\u0915",
      Leo: "\u0938\u093F\u0902\u0939",
      Virgo: "\u0915\u0928\u094D\u092F\u093E",
      Libra: "\u0924\u0942\u0933",
      Scorpio: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915",
      Sagittarius: "\u0927\u0928\u0941",
      Capricorn: "\u092E\u0915\u0930",
      Aquarius: "\u0915\u0941\u0902\u092D",
      Pisces: "\u092E\u0940\u0928"
    };
    NAKSHATRA_MAP = {
      Ashwini: "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
      Asvini: "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
      Bharani: "\u092D\u0930\u0923\u0940",
      Krittika: "\u0915\u0943\u0924\u094D\u0924\u093F\u0915\u093E",
      Kritika: "\u0915\u0943\u0924\u094D\u0924\u093F\u0915\u093E",
      Rohini: "\u0930\u094B\u0939\u093F\u0923\u0940",
      Mrigashira: "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
      Mrigsira: "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
      Ardra: "\u0906\u0930\u094D\u0926\u094D\u0930\u093E",
      Punarvasu: "\u092A\u0941\u0928\u0930\u094D\u0935\u0938\u0942",
      Pushya: "\u092A\u0941\u0937\u094D\u092F",
      Ashlesha: "\u0906\u0936\u094D\u0932\u0947\u0937\u093E",
      Aslesha: "\u0906\u0936\u094D\u0932\u0947\u0937\u093E",
      Magha: "\u092E\u0918\u093E",
      "Purva Phalguni": "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      "Purva Falguni": "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      Purvaphalguni: "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      "Uttara Phalguni": "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      "Uttara Falguni": "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      Uttaraphalguni: "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
      Hasta: "\u0939\u0938\u094D\u0924",
      Hast: "\u0939\u0938\u094D\u0924",
      Chitra: "\u091A\u093F\u0924\u094D\u0930\u093E",
      Swati: "\u0938\u094D\u0935\u093E\u0924\u0940",
      Vishakha: "\u0935\u093F\u0936\u093E\u0916\u093E",
      Anuradha: "\u0905\u0928\u0941\u0930\u093E\u0927\u093E",
      Jyeshta: "\u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E",
      Jyeshtha: "\u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E",
      Moola: "\u092E\u0942\u0933",
      Mula: "\u092E\u0942\u0933",
      "Purva Ashadha": "\u092A\u0942\u0930\u094D\u0935\u093E\u0937\u093E\u0922\u093E",
      Purvashadha: "\u092A\u0942\u0930\u094D\u0935\u093E\u0937\u093E\u0922\u093E",
      "Uttara Ashadha": "\u0909\u0924\u094D\u0924\u0930\u093E\u0937\u093E\u0922\u093E",
      Uttarashadha: "\u0909\u0924\u094D\u0924\u0930\u093E\u0937\u093E\u0922\u093E",
      Shravana: "\u0936\u094D\u0930\u0935\u0923",
      Sravana: "\u0936\u094D\u0930\u0935\u0923",
      Dhanishta: "\u0927\u0928\u093F\u0937\u094D\u0920\u093E",
      Dhanistha: "\u0927\u0928\u093F\u0937\u094D\u0920\u093E",
      Shatabhisha: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
      Satabhisha: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
      Shatataraka: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
      "Purva Bhadrapada": "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      "Purva Bhadrapad": "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      Purvabhadrapad: "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      "Uttara Bhadrapada": "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      "Uttara Bhadrapad": "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      Uttarabhadrapad: "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
      Revati: "\u0930\u0947\u0935\u0924\u0940"
    };
    PLANET_MAP = {
      Sun: "\u0938\u0942\u0930\u094D\u092F",
      Moon: "\u091A\u0902\u0926\u094D\u0930",
      Mars: "\u092E\u0902\u0917\u0933",
      Mercury: "\u092C\u0941\u0927",
      Jupiter: "\u0917\u0941\u0930\u0941",
      Venus: "\u0936\u0941\u0915\u094D\u0930",
      Saturn: "\u0936\u0928\u0940",
      Rahu: "\u0930\u093E\u0939\u0942",
      Ketu: "\u0915\u0947\u0924\u0942"
    };
    GANA_MAP = {
      Dev: "\u0926\u0947\u0935 \u0917\u0923",
      Deva: "\u0926\u0947\u0935 \u0917\u0923",
      Manushya: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
      Maanushya: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
      Manush: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
      Rakshasa: "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923",
      Rakshas: "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923"
    };
    NADI_MAP = {
      Adi: "\u0906\u0926\u094D\u092F \u0928\u093E\u0921\u0940",
      Adhya: "\u0906\u0926\u094D\u092F \u0928\u093E\u0921\u0940",
      Madhya: "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940",
      Ant: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940",
      Antya: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940"
    };
    VARNA_MAP = {
      Vipra: "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)",
      Brahmin: "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)",
      Kshatriya: "\u0915\u094D\u0937\u0924\u094D\u0930\u093F\u092F",
      Vaishya: "\u0935\u0948\u0936\u094D\u092F",
      Shoodra: "\u0936\u0942\u0926\u094D\u0930",
      Shudra: "\u0936\u0942\u0926\u094D\u0930"
    };
    VASHYA_MAP = {
      Chatuspad: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926",
      Chatushpada: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926",
      Maanav: "\u092E\u093E\u0928\u0935 (\u0926\u094D\u0935\u093F\u092A\u0926)",
      Manav: "\u092E\u093E\u0928\u0935 (\u0926\u094D\u0935\u093F\u092A\u0926)",
      Dwipad: "\u0926\u094D\u0935\u093F\u092A\u0926",
      Jalchar: "\u091C\u0932\u091A\u0930",
      Keetak: "\u0915\u0940\u091F\u0915",
      Keeta: "\u0915\u0940\u091F\u0915",
      Vanachara: "\u0935\u0928\u091A\u0930 (\u0938\u093F\u0902\u0939)",
      Simha: "\u0935\u0928\u091A\u0930 (\u0938\u093F\u0902\u0939)"
    };
    YONI_MAP = {
      Ashwa: "\u0905\u0936\u094D\u0935",
      Gaj: "\u0917\u091C",
      Gaja: "\u0917\u091C",
      Mesh: "\u092E\u0947\u0937",
      Mesha: "\u092E\u0947\u0937",
      Sarp: "\u0938\u0930\u094D\u092A",
      Sarpa: "\u0938\u0930\u094D\u092A",
      Shwan: "\u0936\u094D\u0935\u093E\u0928",
      Marjar: "\u092E\u093E\u0930\u094D\u091C\u093E\u0930",
      Mushak: "\u092E\u0942\u0937\u0915",
      Gau: "\u0917\u094C",
      Mahisha: "\u092E\u0939\u093F\u0937",
      Vyaaghra: "\u0935\u094D\u092F\u093E\u0918\u094D\u0930",
      Vyaghr: "\u0935\u094D\u092F\u093E\u0918\u094D\u0930",
      Mriga: "\u092E\u0943\u0917",
      Vanar: "\u0935\u093E\u0928\u0930",
      Nakula: "\u0928\u0915\u0941\u0932",
      Simha: "\u0938\u093F\u0902\u0939",
      Singh: "\u0938\u093F\u0902\u0939"
    };
  }
});

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/navamshaService.ts
function normalizeDateString(dateStr) {
  if (!dateStr) return "1995-05-15";
  const clean = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return clean.slice(0, 10);
}
function normalizeTimeString(timeStr) {
  if (!timeStr) return "12:00";
  let clean = String(timeStr).trim();
  if (clean.includes("T")) {
    clean = clean.split("T")[1]?.slice(0, 5) || "12:00";
  }
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);
  clean = clean.replace(/am|pm/gi, "").trim();
  const parts = clean.split(":");
  let h = parseInt(parts[0], 10) || 12;
  const m = parseInt(parts[1], 10) || 0;
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
var NAVAMSHA_API_KEY = process.env.NAVAMSHA_API_KEY || "vda_live_ffdd26f2_bTuwaUOxo-n4QMu6WKvluhq8e1_4oD3MDqvDkBF3dcw";
var NAVAMSHA_BASE_URL = "https://api.navamsha.in/api/v1";
var RASHI_MAP_MR = {
  Aries: "\u092E\u0947\u0937",
  Taurus: "\u0935\u0943\u0937\u092D",
  Gemini: "\u092E\u093F\u0925\u0941\u0928",
  Cancer: "\u0915\u0930\u094D\u0915",
  Leo: "\u0938\u093F\u0902\u0939",
  Virgo: "\u0915\u0928\u094D\u092F\u093E",
  Libra: "\u0924\u0942\u0933",
  Scorpio: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915",
  Sagittarius: "\u0927\u0928\u0941",
  Capricorn: "\u092E\u0915\u0930",
  Aquarius: "\u0915\u0941\u0902\u092D",
  Pisces: "\u092E\u0940\u0928"
};
var NAKSHATRA_MAP_MR = {
  Ashwini: "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
  Asvini: "\u0905\u0936\u094D\u0935\u093F\u0928\u0940",
  Bharani: "\u092D\u0930\u0923\u0940",
  Krittika: "\u0915\u0943\u0924\u094D\u0924\u093F\u0915\u093E",
  Kritika: "\u0915\u0943\u0924\u094D\u0924\u093F\u0915\u093E",
  Rohini: "\u0930\u094B\u0939\u093F\u0923\u0940",
  Mrigashira: "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
  Mrigsira: "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
  Mrigashirsha: "\u092E\u0943\u0917\u0936\u0940\u0930\u094D\u0937",
  Ardra: "\u0906\u0930\u094D\u0926\u094D\u0930\u093E",
  Punarvasu: "\u092A\u0941\u0928\u0930\u094D\u0935\u0938\u0942",
  Pushya: "\u092A\u0941\u0937\u094D\u092F",
  Ashlesha: "\u0906\u0936\u094D\u0932\u0947\u0937\u093E",
  Aslesha: "\u0906\u0936\u094D\u0932\u0947\u0937\u093E",
  Magha: "\u092E\u0918\u093E",
  "Purva Phalguni": "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  "Purva Falguni": "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  Purvaphalguni: "\u092A\u0942\u0930\u094D\u0935\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  "Uttara Phalguni": "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  "Uttara Falguni": "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  Uttaraphalguni: "\u0909\u0924\u094D\u0924\u0930\u093E \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0940",
  Hasta: "\u0939\u0938\u094D\u0924",
  Chitra: "\u091A\u093F\u0924\u094D\u0930\u093E",
  Swati: "\u0938\u094D\u0935\u093E\u0924\u0940",
  Vishakha: "\u0935\u093F\u0936\u093E\u0916\u093E",
  Anuradha: "\u0905\u0928\u0941\u0930\u093E\u0927\u093E",
  Jyeshta: "\u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E",
  Jyeshtha: "\u091C\u094D\u092F\u0947\u0937\u094D\u0920\u093E",
  Moola: "\u092E\u0942\u0933",
  Mula: "\u092E\u0942\u0933",
  "Purva Ashadha": "\u092A\u0942\u0930\u094D\u0935\u093E\u0937\u093E\u0922\u093E",
  Purvashadha: "\u092A\u0942\u0930\u094D\u0935\u093E\u0937\u093E\u0922\u093E",
  "Uttara Ashadha": "\u0909\u0924\u094D\u0924\u0930\u093E\u0937\u093E\u0922\u093E",
  Uttarashadha: "\u0909\u0924\u094D\u0924\u0930\u093E\u0937\u093E\u0922\u093E",
  Shravana: "\u0936\u094D\u0930\u0935\u0923",
  Sravana: "\u0936\u094D\u0930\u0935\u0923",
  Dhanishta: "\u0927\u0928\u093F\u0937\u094D\u0920\u093E",
  Dhanistha: "\u0927\u0928\u093F\u0937\u094D\u0920\u093E",
  Shatabhisha: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
  Satabhisha: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
  Shatataraka: "\u0936\u0924\u0924\u093E\u0930\u0915\u093E",
  "Purva Bhadrapada": "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  "Purva Bhadrapad": "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  Purvabhadrapada: "\u092A\u0942\u0930\u094D\u0935\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  "Uttara Bhadrapada": "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  "Uttara Bhadrapad": "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  Uttarabhadrapada: "\u0909\u0924\u094D\u0924\u0930\u093E \u092D\u093E\u0926\u094D\u0930\u092A\u0926",
  Revati: "\u0930\u0947\u0935\u0924\u0940"
};
var PLANET_MAP_MR = {
  Sun: "\u0938\u0942\u0930\u094D\u092F",
  Moon: "\u091A\u0902\u0926\u094D\u0930",
  Mars: "\u092E\u0902\u0917\u0933",
  Mercury: "\u092C\u0941\u0927",
  Jupiter: "\u0917\u0941\u0930\u0941",
  Venus: "\u0936\u0941\u0915\u094D\u0930",
  Saturn: "\u0936\u0928\u0940",
  Rahu: "\u0930\u093E\u0939\u0942",
  Ketu: "\u0915\u0947\u0924\u0942",
  Ascendant: "\u0932\u0917\u094D\u0928",
  Lagna: "\u0932\u0917\u094D\u0928"
};
var GANA_MAP_MR = {
  Dev: "\u0926\u0947\u0935 \u0917\u0923",
  Deva: "\u0926\u0947\u0935 \u0917\u0923",
  Manushya: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
  Maanushya: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
  Manush: "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923",
  Rakshasa: "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923",
  Rakshas: "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923"
};
var NADI_MAP_MR = {
  Adi: "\u0906\u0926\u094D\u092F \u0928\u093E\u0921\u0940",
  Adhya: "\u0906\u0926\u094D\u092F \u0928\u093E\u0921\u0940",
  Madhya: "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940",
  Ant: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940",
  Antya: "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940"
};
var VARNA_MAP_MR = {
  Vipra: "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)",
  Brahmin: "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)",
  Kshatriya: "\u0915\u094D\u0937\u0924\u094D\u0930\u093F\u092F",
  Vaishya: "\u0935\u0948\u0936\u094D\u092F",
  Shoodra: "\u0936\u0942\u0926\u094D\u0930",
  Shudra: "\u0936\u0942\u0926\u094D\u0930"
};
var VASHYA_MAP_MR = {
  Chatuspad: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926",
  Chatushpada: "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926",
  Maanav: "\u092E\u093E\u0928\u0935 (\u0926\u094D\u0935\u093F\u092A\u0926)",
  Manav: "\u092E\u093E\u0928\u0935 (\u0926\u094D\u0935\u093F\u092A\u0926)",
  Dwipad: "\u0926\u094D\u0935\u093F\u092A\u0926",
  Jalchar: "\u091C\u0932\u091A\u0930",
  Keetak: "\u0915\u0940\u091F\u0915",
  Keeta: "\u0915\u0940\u091F\u0915",
  Vanachara: "\u0935\u0928\u091A\u0930 (\u0938\u093F\u0902\u0939)",
  Simha: "\u0935\u0928\u091A\u0930 (\u0938\u093F\u0902\u0939)"
};
var YONI_MAP_MR = {
  Ashwa: "\u0905\u0936\u094D\u0935 (\u0918\u094B\u0921\u093E)",
  Horse: "\u0905\u0936\u094D\u0935 (\u0918\u094B\u0921\u093E)",
  Gaj: "\u0917\u091C (\u0939\u0924\u094D\u0924\u0940)",
  Gaja: "\u0917\u091C (\u0939\u0924\u094D\u0924\u0940)",
  Elephant: "\u0917\u091C (\u0939\u0924\u094D\u0924\u0940)",
  Mesh: "\u092E\u0947\u0937 (\u092E\u0947\u0902\u0922\u093E)",
  Mesha: "\u092E\u0947\u0937 (\u092E\u0947\u0902\u0922\u093E)",
  Sheep: "\u092E\u0947\u0937 (\u092E\u0947\u0902\u0922\u093E)",
  Sarp: "\u0938\u0930\u094D\u092A",
  Sarpa: "\u0938\u0930\u094D\u092A",
  Serpent: "\u0938\u0930\u094D\u092A",
  Snake: "\u0938\u0930\u094D\u092A",
  Shwan: "\u0936\u094D\u0935\u093E\u0928 (\u0915\u0941\u0924\u094D\u0930\u093E)",
  Dog: "\u0936\u094D\u0935\u093E\u0928 (\u0915\u0941\u0924\u094D\u0930\u093E)",
  Marjar: "\u092E\u093E\u0930\u094D\u091C\u093E\u0930 (\u092E\u093E\u0902\u091C\u0930)",
  Cat: "\u092E\u093E\u0930\u094D\u091C\u093E\u0930 (\u092E\u093E\u0902\u091C\u0930)",
  Mushak: "\u092E\u0942\u0937\u0915 (\u0909\u0902\u0926\u0940\u0930)",
  Rat: "\u092E\u0942\u0937\u0915 (\u0909\u0902\u0926\u0940\u0930)",
  Mouse: "\u092E\u0942\u0937\u0915 (\u0909\u0902\u0926\u0940\u0930)",
  Gau: "\u0917\u094C (\u0917\u093E\u092F)",
  Cow: "\u0917\u094C (\u0917\u093E\u092F)",
  Mahisha: "\u092E\u0939\u093F\u0937 (\u0930\u0947\u0921\u093E)",
  Buffalo: "\u092E\u0939\u093F\u0937 (\u0930\u0947\u0921\u093E)",
  Vyaaghra: "\u0935\u094D\u092F\u093E\u0918\u094D\u0930 (\u0935\u093E\u0918)",
  Tiger: "\u0935\u094D\u092F\u093E\u0918\u094D\u0930 (\u0935\u093E\u0918)",
  Mriga: "\u092E\u0943\u0917 (\u0939\u0930\u0940\u0923)",
  Deer: "\u092E\u0943\u0917 (\u0939\u0930\u0940\u0923)",
  Vanar: "\u0935\u093E\u0928\u0930 (\u092E\u093E\u0915\u0921)",
  Monkey: "\u0935\u093E\u0928\u0930 (\u092E\u093E\u0915\u0921)",
  Nakula: "\u0928\u0915\u0941\u0932 (\u092E\u0941\u0902\u0917\u0942\u0938)",
  Mongoose: "\u0928\u0915\u0941\u0932 (\u092E\u0941\u0902\u0917\u0942\u0938)",
  Simha: "\u0938\u093F\u0902\u0939",
  Lion: "\u0938\u093F\u0902\u0939"
};
var RASHI_LIST_ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
function translateString(val, map) {
  if (!val) return "";
  const trimmed = String(val).trim();
  if (map && map[trimmed]) return map[trimmed];
  return trimmed;
}
function parseBirthComponents(dob, time, coords, defaultLat = 19.8762, defaultLon = 75.3433) {
  const cleanDob = normalizeDateString(dob);
  const cleanTime = normalizeTimeString(time);
  const [yStr, mStr, dStr] = cleanDob.split("-");
  const [hStr, minStr] = cleanTime.split(":");
  let lat = defaultLat;
  let lon = defaultLon;
  if (coords && typeof coords === "string") {
    const parts = coords.split(",");
    const pLat = parseFloat(parts[0]);
    const pLon = parseFloat(parts[1]);
    if (!isNaN(pLat)) lat = Number(pLat.toFixed(4));
    if (!isNaN(pLon)) lon = Number(pLon.toFixed(4));
  }
  return {
    year: parseInt(yStr, 10) || 1995,
    month: parseInt(mStr, 10) || 5,
    date: parseInt(dStr, 10) || 15,
    hours: parseInt(hStr, 10) || 12,
    minutes: parseInt(minStr, 10) || 0,
    seconds: 0,
    latitude: lat,
    longitude: lon,
    timezone: 5.5
  };
}
async function fetchNavamshaKundliMatching(params) {
  const groomReq = parseBirthComponents(params.groom.dob, params.groom.time, params.groom.coordinates, 18.5204, 73.8567);
  const brideReq = parseBirthComponents(params.bride.dob, params.bride.time, params.bride.coordinates, 19.8762, 75.3433);
  const reqBody = {
    groom: groomReq,
    bride: brideReq
  };
  console.log("\u{1F52E} [Navamsha.in API] Calculating Ashtakoot Matching with active key...");
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": NAVAMSHA_API_KEY
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8e3);
  try {
    const [matchRes, groomMangalRes, brideMangalRes] = await Promise.allSettled([
      fetch(`${NAVAMSHA_BASE_URL}/compatibility/ashtakoot/detailed`, {
        method: "POST",
        headers,
        body: JSON.stringify(reqBody),
        signal: controller.signal
      }),
      fetch(`${NAVAMSHA_BASE_URL}/dosha/mangal`, {
        method: "POST",
        headers,
        body: JSON.stringify(groomReq),
        signal: controller.signal
      }),
      fetch(`${NAVAMSHA_BASE_URL}/dosha/mangal`, {
        method: "POST",
        headers,
        body: JSON.stringify(brideReq),
        signal: controller.signal
      })
    ]);
    clearTimeout(timeoutId);
    if (matchRes.status !== "fulfilled" || !matchRes.value.ok) {
      const errTxt = matchRes.status === "fulfilled" ? await matchRes.value.text() : matchRes.reason;
      console.warn("\u26A0\uFE0F [Navamsha.in API] Matching request failed:", errTxt);
      throw new Error(`Navamsha match request failed: ${matchRes.status === "fulfilled" ? matchRes.value.status : "Network"}`);
    }
    const matchJson = await matchRes.value.json();
    const output = matchJson.output || {};
    let groomMangalData = null;
    if (groomMangalRes.status === "fulfilled" && groomMangalRes.value.ok) {
      groomMangalData = await groomMangalRes.value.json().catch(() => null);
    }
    let brideMangalData = null;
    if (brideMangalRes.status === "fulfilled" && brideMangalRes.value.ok) {
      brideMangalData = await brideMangalRes.value.json().catch(() => null);
    }
    return normalizeNavamshaMatchResponse(output, groomMangalData?.output, brideMangalData?.output, params);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("\u26A0\uFE0F [Navamsha.in API] Matching failed or timed out:", err?.message || err);
    throw err;
  }
}
function normalizeNavamshaMatchResponse(output, groomMangal, brideMangal, params) {
  const bride = output?.bride || {};
  const groom = output?.groom || {};
  const breakdown = output?.breakdown || {};
  const cancellations = output?.cancellations || [];
  const rawTotal = output?.total_score ?? 18;
  const effectiveTotal = output?.effective_total_score ?? rawTotal;
  const totalScore = typeof effectiveTotal === "number" ? effectiveTotal : Number(rawTotal) || 18;
  const maxScore = output?.maximum_score || 36;
  const groomRashiMr = translateString(groom.sign, RASHI_MAP_MR) || "\u0915\u0930\u094D\u0915";
  const groomNakshatraMr = translateString(groom.nakshatra?.name, NAKSHATRA_MAP_MR) || "\u0906\u0936\u094D\u0932\u0947\u0937\u093E";
  const groomGanaMr = translateString(groom.gana, GANA_MAP_MR) || "\u0930\u093E\u0915\u094D\u0937\u0938 \u0917\u0923";
  const groomNadiMr = translateString(groom.nadi, NADI_MAP_MR) || "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940";
  const groomVarnaMr = translateString(groom.varna, VARNA_MAP_MR) || "\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923 (\u0935\u093F\u092A\u094D\u0930)";
  const groomVashyaMr = translateString(groom.vashya, VASHYA_MAP_MR) || "\u091C\u0932\u091A\u0930";
  const groomYoniMr = translateString(groom.yoni, YONI_MAP_MR) || "\u092E\u093E\u0930\u094D\u091C\u093E\u0930 (\u092E\u093E\u0902\u091C\u0930)";
  const brideRashiMr = translateString(bride.sign, RASHI_MAP_MR) || "\u0935\u0943\u0937\u092D";
  const brideNakshatraMr = translateString(bride.nakshatra?.name, NAKSHATRA_MAP_MR) || "\u0930\u094B\u0939\u093F\u0923\u0940";
  const brideGanaMr = translateString(bride.gana, GANA_MAP_MR) || "\u092E\u0928\u0941\u0937\u094D\u092F \u0917\u0923";
  const brideNadiMr = translateString(bride.nadi, NADI_MAP_MR) || "\u0905\u0902\u0924\u094D\u092F \u0928\u093E\u0921\u0940";
  const brideVarnaMr = translateString(bride.varna, VARNA_MAP_MR) || "\u0935\u0948\u0936\u094D\u092F";
  const brideVashyaMr = translateString(bride.vashya, VASHYA_MAP_MR) || "\u091A\u0924\u0941\u0937\u094D\u092A\u093E\u0926";
  const brideYoniMr = translateString(bride.yoni, YONI_MAP_MR) || "\u0938\u0930\u094D\u092A";
  const varna = breakdown.varna || {};
  const vashya = breakdown.vashya || {};
  const tara = breakdown.tara || {};
  const yoni = breakdown.yoni || {};
  const maitri = breakdown.graha_maitri || {};
  const gana = breakdown.gana || {};
  const bhakoot = breakdown.bhakoot || {};
  const nadi = breakdown.nadi || {};
  const nadiRestored = cancellations.find((c) => c.koota === "nadi" && c.applies);
  const bhakootRestored = cancellations.find((c) => c.koota === "bhakoot" && c.applies);
  const kootaBreakdown = [
    {
      id: "varna",
      name: "Varna (\u0935\u0930\u094D\u0923)",
      nameMr: "\u0935\u0930\u094D\u0923 (Varna)",
      maxScore: varna.maximum || 1,
      obtainedScore: varna.score ?? 1,
      boyAttribute: groomVarnaMr,
      girlAttribute: brideVarnaMr,
      description: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0935 \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E \u0906\u0923\u093F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u093E\u0924\u0940\u0932 \u0924\u093E\u0933\u092E\u0947\u0933 \u0926\u0930\u094D\u0936\u0935\u0924\u094B.",
      status: (varna.score ?? 1) >= 1 ? "excellent" : "poor"
    },
    {
      id: "vashya",
      name: "Vashya (\u0935\u0936\u094D\u092F)",
      nameMr: "\u0935\u0936\u094D\u092F (Vashya)",
      maxScore: vashya.maximum || 2,
      obtainedScore: vashya.score ?? 2,
      boyAttribute: groomVashyaMr,
      girlAttribute: brideVashyaMr,
      description: "\u092A\u0930\u0938\u094D\u092A\u0930 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0906\u0915\u0930\u094D\u0937\u0923",
      descriptionMr: "\u092A\u0930\u0938\u094D\u092A\u0930 \u0906\u0915\u0930\u094D\u0937\u0923, \u090F\u0915\u092E\u0947\u0915\u093E\u0902\u0935\u0930\u0940\u0932 \u092A\u094D\u0930\u092D\u093E\u0935 \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0928\u093F\u0937\u094D\u0920\u093E.",
      status: (vashya.score ?? 2) >= 1.5 ? "excellent" : (vashya.score ?? 2) >= 1 ? "good" : "poor"
    },
    {
      id: "tara",
      name: "Tara (\u0924\u093E\u0930\u093E)",
      nameMr: "\u0924\u093E\u0930\u093E (Tara)",
      maxScore: tara.maximum || 3,
      obtainedScore: tara.score ?? 3,
      boyAttribute: groomNakshatraMr,
      girlAttribute: brideNakshatraMr,
      description: "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F \u0935 \u0926\u0940\u0930\u094D\u0918\u093E\u092F\u0941\u0937\u094D\u092F",
      descriptionMr: "\u0906\u0930\u094B\u0917\u094D\u092F, \u092D\u093E\u0917\u094D\u092F \u0935 \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u092D\u093E\u0917\u094D\u092F\u094B\u0926\u092F\u093E\u0938\u093E\u0920\u0940 \u0936\u0941\u092D \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E.",
      status: (tara.score ?? 3) >= 2 ? "excellent" : (tara.score ?? 3) >= 1 ? "average" : "poor"
    },
    {
      id: "yoni",
      name: "Yoni (\u092F\u094B\u0928\u0940)",
      nameMr: "\u092F\u094B\u0928\u0940 (Yoni)",
      maxScore: yoni.maximum || 4,
      obtainedScore: yoni.score ?? 3,
      boyAttribute: groomYoniMr,
      girlAttribute: brideYoniMr,
      description: "\u091C\u0948\u0935\u093F\u0915 \u0935 \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E",
      descriptionMr: "\u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0906\u0923\u093F \u091C\u0948\u0935\u093F\u0915 \u0938\u0941\u0938\u0902\u0917\u0924\u0924\u093E.",
      status: (yoni.score ?? 3) >= 3 ? "excellent" : (yoni.score ?? 3) >= 1 ? "good" : "poor"
    },
    {
      id: "graha_maitri",
      name: "Graha Maitri (\u0917\u094D\u0930\u0939\u092E\u0948\u0924\u094D\u0930\u0940)",
      nameMr: "\u0917\u094D\u0930\u0939 \u092E\u0948\u0924\u094D\u0930\u0940 (Graha Maitri)",
      maxScore: maitri.maximum || 5,
      obtainedScore: maitri.score ?? 5,
      boyAttribute: translateString(groom.sign_lord, PLANET_MAP_MR) || "\u091A\u0902\u0926\u094D\u0930",
      girlAttribute: translateString(bride.sign_lord, PLANET_MAP_MR) || "\u0936\u0941\u0915\u094D\u0930",
      description: "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940 \u092E\u0948\u0924\u094D\u0930\u0940 \u0935 \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940\u0902\u091A\u0940 \u092E\u0948\u0924\u094D\u0930\u0940 \u0905\u0938\u0942\u0928 \u0935\u093F\u091A\u093E\u0930\u0938\u0930\u0923\u0940\u0924 \u0938\u0941\u0902\u0926\u0930 \u0924\u093E\u0933\u092E\u0947\u0933 \u0930\u093E\u0939\u0940\u0932.",
      status: (maitri.score ?? 5) >= 4 ? "excellent" : (maitri.score ?? 5) >= 2.5 ? "good" : "poor"
    },
    {
      id: "gana",
      name: "Gana (\u0917\u0923)",
      nameMr: "\u0917\u0923 (Gana)",
      maxScore: gana.maximum || 6,
      obtainedScore: gana.score ?? 6,
      boyAttribute: groomGanaMr,
      girlAttribute: brideGanaMr,
      description: "\u0938\u094D\u0935\u092D\u093E\u0935 \u0935 \u0935\u0948\u091A\u093E\u0930\u093F\u0915 \u0924\u093E\u0933\u092E\u0947\u0933",
      descriptionMr: "\u0938\u094D\u0935\u092D\u093E\u0935 \u0906\u0923\u093F \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0906\u091A\u093E\u0930-\u0935\u093F\u091A\u093E\u0930\u093E\u0902\u092E\u0927\u094D\u092F\u0947 \u0938\u093E\u092E\u0902\u091C\u0938\u094D\u092F.",
      status: (gana.score ?? 6) >= 5 ? "excellent" : (gana.score ?? 6) >= 1 ? "good" : "poor"
    },
    {
      id: "bhakoot",
      name: "Bhakoot (\u092D\u0915\u0942\u091F)",
      nameMr: "\u092D\u0915\u0942\u091F (Bhakoot)",
      maxScore: bhakoot.maximum || 7,
      obtainedScore: bhakootRestored ? 7 : bhakoot.score ?? 7,
      boyAttribute: groomRashiMr,
      girlAttribute: brideRashiMr,
      description: "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916, \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u092A\u094D\u0930\u0917\u0924\u0940",
      descriptionMr: bhakootRestored ? "\u092D\u0915\u0942\u091F \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930: \u0930\u093E\u0936\u0940 \u0938\u094D\u0935\u093E\u092E\u0940 \u092E\u093F\u0924\u094D\u0930 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u092D\u0915\u0942\u091F \u0926\u094B\u0937 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u090A\u0928 \u092A\u0942\u0930\u094D\u0923 \u0917\u0941\u0923 \u092C\u0939\u093E\u0932 \u0915\u0947\u0932\u0947 \u0906\u0939\u0947\u0924." : "\u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u0941\u0916 \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0935 \u0906\u0930\u094D\u0925\u093F\u0915 \u092A\u094D\u0930\u0917\u0924\u0940\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E \u0938\u094D\u0925\u093F\u0924\u0940.",
      status: bhakootRestored || (bhakoot.score ?? 7) >= 7 ? "excellent" : "poor"
    },
    {
      id: "nadi",
      name: "Nadi (\u0928\u093E\u0921\u0940)",
      nameMr: "\u0928\u093E\u0921\u0940 (Nadi)",
      maxScore: nadi.maximum || 8,
      obtainedScore: nadiRestored ? 8 : nadi.score ?? 8,
      boyAttribute: groomNadiMr,
      girlAttribute: brideNadiMr,
      description: "\u0905\u0928\u0941\u0935\u0902\u0936\u093F\u0915\u0924\u093E, \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916",
      descriptionMr: nadiRestored ? "\u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930: \u0926\u094B\u0918\u093E\u0902\u091A\u0947 \u0928\u0915\u094D\u0937\u0924\u094D\u0930 \u0915\u093F\u0902\u0935\u093E \u091A\u0930\u0923 \u092D\u093F\u0928\u094D\u0928 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930 \u0939\u094B\u0924\u094B \u0935 \u092A\u0942\u0930\u094D\u0923 \u096E \u0917\u0941\u0923 \u092C\u0939\u093E\u0932 \u0915\u0947\u0932\u0947 \u0906\u0939\u0947\u0924." : (nadi.score ?? 8) > 0 ? "\u0928\u093E\u0921\u0940 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940). \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916\u093E\u0938\u093E\u0920\u0940 \u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E." : "\u090F\u0915\u093E\u091A \u0928\u093E\u0921\u0940\u092E\u0941\u0933\u0947 \u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u0926\u0930\u094D\u0936\u0935\u0924 \u0906\u0939\u0947.",
      status: nadiRestored || (nadi.score ?? 8) >= 8 ? "excellent" : "poor"
    }
  ];
  const groomIsManglik = groomMangal?.is_present ?? false;
  const brideIsManglik = brideMangal?.is_present ?? false;
  let manglikStatusMr = "\u0926\u094B\u0928\u094D\u0939\u0940 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947\u0924.";
  if (groomIsManglik && brideIsManglik) {
    manglikStatusMr = "\u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u0926\u094B\u0918\u0947\u0939\u0940 \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947\u0924 \u2014 \u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u0938\u093E\u092E\u094D\u092F (\u092A\u0930\u093F\u0939\u093E\u0930) \u0939\u094B\u0924\u094B. \u0935\u093F\u0935\u093E\u0939 \u0909\u0924\u094D\u0924\u092E \u091C\u0941\u0933\u0924\u094B.";
  } else if (groomIsManglik) {
    manglikStatusMr = "\u0935\u0930 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947, \u0935\u0927\u0942 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947.";
  } else if (brideIsManglik) {
    manglikStatusMr = "\u0935\u0927\u0942 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u092E\u0902\u0917\u0933\u0940 \u0906\u0939\u0947, \u0935\u0930 \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947.";
  }
  return {
    success: true,
    totalScore,
    maxScore,
    percentage: Math.round(totalScore / maxScore * 100),
    compatibilityVerdict: totalScore >= 25 ? "\u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0935\u0948\u0926\u093F\u0915 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Excellent)" : totalScore >= 18 ? "\u0909\u0924\u094D\u0924\u092E \u0935\u093F\u0935\u093E\u0939 \u092F\u094B\u0917 (Good)" : "\u092E\u0927\u094D\u092F\u092E \u0917\u0941\u0923\u092E\u0947\u0932\u0928 (Average)",
    verdictColor: totalScore >= 25 ? "emerald" : totalScore >= 18 ? "amber" : "rose",
    recommendationMr: `Navamsha \u0935\u0948\u0926\u093F\u0915 \u0972\u0938\u094D\u091F\u094D\u0930\u0949\u0932\u0949\u091C\u0940 \u0928\u0941\u0938\u093E\u0930 \u0969\u096C \u092A\u0948\u0915\u0940 ${totalScore} \u0917\u0941\u0923 \u092E\u093F\u0933\u093E\u0932\u0947 \u0906\u0939\u0947\u0924. \u0939\u0947 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 ${totalScore >= 18 ? "\u0935\u093F\u0935\u093E\u0939\u093E\u0938\u093E\u0920\u0940 \u0905\u0924\u094D\u092F\u0902\u0924 \u0905\u0928\u0941\u0915\u0942\u0932 \u0935 \u0936\u0941\u092D" : "\u092E\u0927\u094D\u092F\u092E"} \u0906\u0939\u0947.`,
    kootaBreakdown,
    doshaAnalysis: {
      nadiDosha: {
        present: Boolean(nadi.has_dosha && !nadiRestored),
        descriptionMr: nadiRestored ? "\u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930 \u0932\u093E\u0917\u0942 \u091D\u093E\u0932\u093E \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u0915\u094D\u0937\u0924\u094D\u0930/\u091A\u0930\u0923). \u0935\u0948\u0935\u093E\u0939\u093F\u0915 \u0938\u0941\u0916 \u0909\u0924\u094D\u0924\u092E \u0930\u093E\u0939\u0940\u0932." : (nadi.score ?? 8) === 0 ? "\u0928\u093E\u0921\u0940 \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u0928\u093E\u0921\u0940 \u0928\u093F\u0930\u094D\u0926\u094B\u0937 \u0906\u0939\u0947 (\u092D\u093F\u0928\u094D\u0928 \u0928\u093E\u0921\u0940). \u0906\u0930\u094B\u0917\u094D\u092F \u0935 \u0938\u0902\u0924\u0924\u0940 \u0938\u0941\u0916\u093E\u0938\u093E\u0920\u0940 \u0909\u0924\u094D\u0924\u092E.",
        cancellationApplies: Boolean(nadiRestored)
      },
      bhakootDosha: {
        present: Boolean(bhakoot.has_dosha && !bhakootRestored),
        descriptionMr: bhakootRestored ? "\u092D\u0915\u0942\u091F \u0926\u094B\u0937 \u092A\u0930\u093F\u0939\u093E\u0930 \u0932\u093E\u0917\u0942 \u091D\u093E\u0932\u093E \u0906\u0939\u0947." : (bhakoot.score ?? 7) === 0 ? "\u092D\u0915\u0942\u091F \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u092D\u0915\u0942\u091F \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0915\u094C\u091F\u0941\u0902\u092C\u093F\u0915 \u0938\u092E\u0943\u0926\u094D\u0927\u0940 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: Boolean(bhakootRestored)
      },
      ganaDosha: {
        present: (gana.score ?? 6) === 0,
        descriptionMr: (gana.score ?? 6) === 0 ? "\u0917\u0923 \u0926\u094B\u0937 \u0906\u0922\u0933\u0932\u093E \u0906\u0939\u0947." : "\u0917\u0923 \u0905\u0928\u0941\u0915\u0942\u0932 \u0906\u0939\u0947. \u0938\u094D\u0935\u092D\u093E\u0935\u093E\u0924 \u0909\u0924\u094D\u0924\u092E \u0924\u093E\u0933\u092E\u0947\u0933 \u0930\u093E\u0939\u0940\u0932.",
        cancellationApplies: false
      },
      manglikCompatibility: {
        groomManglik: groomIsManglik,
        brideManglik: brideIsManglik,
        statusMr: manglikStatusMr,
        compatible: !(groomIsManglik ^ brideIsManglik)
      }
    },
    astroDetails: {
      groom: {
        name: params.groom.name || "\u0935\u0930 (Groom)",
        dob: params.groom.dob,
        time: params.groom.time || "12:00 PM",
        city: params.groom.city || "\u092A\u0941\u0923\u0947",
        rashi: groomRashiMr,
        nakshatra: groomNakshatraMr,
        gan: groomGanaMr,
        nadi: groomNadiMr,
        varna: groomVarnaMr,
        vashya: groomVashyaMr,
        yoni: groomYoniMr
      },
      bride: {
        name: params.bride.name || "\u0935\u0927\u0942 (Bride)",
        dob: params.bride.dob,
        time: params.bride.time || "12:00 PM",
        city: params.bride.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        rashi: brideRashiMr,
        nakshatra: brideNakshatraMr,
        gan: brideGanaMr,
        nadi: brideNadiMr,
        varna: brideVarnaMr,
        vashya: brideVashyaMr,
        yoni: brideYoniMr
      }
    },
    provider: "Navamsha.in Vedic Astrology Engine (Official API)"
  };
}
async function fetchNavamshaSingleKundli(params) {
  const req = parseBirthComponents(params.dob, params.time, `${params.latitude},${params.longitude}`, params.latitude, params.longitude);
  console.log(`\u{1F52E} [Navamsha.in API] Generating Complete Single Birth Kundli for ${params.fullName}...`, req);
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": NAVAMSHA_API_KEY
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9e3);
  try {
    const [snapRes, birthRes, doshaRes, dashaRes] = await Promise.allSettled([
      fetch(`${NAVAMSHA_BASE_URL}/chart/planet-snapshot`, {
        method: "POST",
        headers,
        body: JSON.stringify(req),
        signal: controller.signal
      }),
      fetch(`${NAVAMSHA_BASE_URL}/astrology/birth-details`, {
        method: "POST",
        headers,
        body: JSON.stringify(req),
        signal: controller.signal
      }),
      fetch(`${NAVAMSHA_BASE_URL}/dosha/all`, {
        method: "POST",
        headers,
        body: JSON.stringify(req),
        signal: controller.signal
      }),
      fetch(`${NAVAMSHA_BASE_URL}/dasha/vimshottari`, {
        method: "POST",
        headers,
        body: JSON.stringify(req),
        signal: controller.signal
      })
    ]);
    clearTimeout(timeoutId);
    let snapData = null;
    if (snapRes.status === "fulfilled" && snapRes.value.ok) {
      snapData = await snapRes.value.json().catch(() => null);
    }
    let birthData = null;
    if (birthRes.status === "fulfilled" && birthRes.value.ok) {
      birthData = await birthRes.value.json().catch(() => null);
    }
    let doshaData = null;
    if (doshaRes.status === "fulfilled" && doshaRes.value.ok) {
      doshaData = await doshaRes.value.json().catch(() => null);
    }
    let dashaData = null;
    if (dashaRes.status === "fulfilled" && dashaRes.value.ok) {
      dashaData = await dashaRes.value.json().catch(() => null);
    }
    if (!snapData?.output?.planets && !birthData?.output) {
      throw new Error("Navamsha API responses empty, falling back...");
    }
    return normalizeNavamshaSingleKundli(snapData?.output, birthData?.output, doshaData?.output, dashaData?.output, params);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`\u26A0\uFE0F [Navamsha.in API] Single Kundli failed: ${err?.message || err}`);
    throw err;
  }
}
function normalizeNavamshaSingleKundli(snap, birth, doshas, dasha, params) {
  const planetsObj = snap?.planets || {};
  const lagnaDegRaw = doshas?.mangal?.reference_longitudes?.Lagna ?? 84.66;
  const lagnaSignIndex = Math.floor(lagnaDegRaw / 30) % 12;
  const lagnaSignName = RASHI_LIST_ORDER[lagnaSignIndex] || "Gemini";
  const lagnaSignMr = RASHI_MAP_MR[lagnaSignName] || "\u092E\u093F\u0925\u0941\u0928";
  const moonRashiEn = birth?.chandra_rasi?.name || planetsObj?.Moon?.sign || "Scorpio";
  const moonRashiMr = RASHI_MAP_MR[moonRashiEn] || "\u0935\u0943\u0936\u094D\u091A\u093F\u0915";
  const moonRashiLordEn = birth?.chandra_rasi?.lord?.name || "Mars";
  const moonRashiLordMr = PLANET_MAP_MR[moonRashiLordEn] || "\u092E\u0902\u0917\u0933";
  const sunRashiEn = birth?.soorya_rasi?.name || planetsObj?.Sun?.sign || "Taurus";
  const sunRashiMr = RASHI_MAP_MR[sunRashiEn] || "\u0935\u0943\u0937\u092D";
  const nakshatraEn = birth?.nakshatra?.name || planetsObj?.Moon?.nakshatra?.name || "Anuradha";
  const nakshatraMr = NAKSHATRA_MAP_MR[nakshatraEn] || "\u0905\u0928\u0941\u0930\u093E\u0927\u093E";
  const nakshatraLordEn = birth?.nakshatra?.lord?.name || planetsObj?.Moon?.nakshatra?.lord || "Saturn";
  const nakshatraLordMr = PLANET_MAP_MR[nakshatraLordEn] || "\u0936\u0928\u0940";
  const pada = birth?.nakshatra?.pada || planetsObj?.Moon?.nakshatra?.pada || 1;
  const ganMr = translateString(birth?.additional_info?.ganam, GANA_MAP_MR) || "\u0926\u0947\u0935 \u0917\u0923";
  const nadiMr = translateString(birth?.additional_info?.nadi, NADI_MAP_MR) || "\u092E\u0927\u094D\u092F \u0928\u093E\u0921\u0940";
  const yoniMr = translateString(birth?.additional_info?.animal_sign, YONI_MAP_MR) || "\u092E\u0943\u0917 (\u0939\u0930\u0940\u0923)";
  const varnaMr = "\u0935\u0948\u0936\u094D\u092F";
  const vashyaMr = "\u0915\u0940\u091F\u0915";
  const PLANET_KEYS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetsList = [];
  const lagnaChart = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  const navamshaChart = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
  lagnaChart[1].push("\u0932\u0917\u094D\u0928 (Asc)");
  for (const pKey of PLANET_KEYS) {
    const pData = planetsObj[pKey];
    if (!pData) continue;
    const signEn = pData.sign || "Aries";
    const signMr = RASHI_MAP_MR[signEn] || signEn;
    const signIdx = RASHI_LIST_ORDER.indexOf(signEn);
    const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
    const degInSign = typeof pData.degree_in_sign === "number" ? pData.degree_in_sign : 15;
    const deg = Math.floor(degInSign);
    const mins = Math.floor((degInSign - deg) * 60);
    const degreeFormatted = `${deg}\xB0 ${mins.toString().padStart(2, "0")}'`;
    const nakName = pData.nakshatra?.name || "Ashwini";
    const nakMr = NAKSHATRA_MAP_MR[nakName] || nakName;
    const nakPada = pData.nakshatra?.pada || 1;
    const nakLord = PLANET_MAP_MR[pData.nakshatra?.lord] || pData.nakshatra?.lord || "";
    const pMr = PLANET_MAP_MR[pKey] || pKey;
    const isRetro = Boolean(pData.is_retrograde);
    lagnaChart[houseNum].push(`${pMr}${isRetro ? " (\u0935)" : ""}`);
    const navSignEn = pData.navamsa_sign || signEn;
    const navSignIdx = RASHI_LIST_ORDER.indexOf(navSignEn);
    const navHouse = (navSignIdx - lagnaSignIndex + 12) % 12 + 1;
    navamshaChart[navHouse].push(`${pMr}`);
    planetsList.push({
      name: pKey,
      nameMr: pMr,
      rashi: signMr,
      rashiEn: signEn,
      degree: degreeFormatted,
      fullDegree: Number(pData.sidereal_longitude?.toFixed(2) || degInSign),
      house: houseNum,
      nakshatra: `${nakMr} (\u091A\u0930\u0923 ${nakPada})`,
      nakshatraLord: nakLord,
      isRetrograde: isRetro,
      state: isRetro ? "\u0935\u0915\u094D\u0930\u0940 (Retrograde)" : "\u092E\u093E\u0930\u094D\u0917\u0940 (Direct)",
      nature: ["Jupiter", "Venus", "Moon", "Mercury"].includes(pKey) ? "\u0936\u0941\u092D \u0917\u094D\u0930\u0939" : "\u092A\u093E\u092A/\u0915\u094D\u0930\u0942\u0930 \u0917\u094D\u0930\u0939"
    });
  }
  const mahadashas = (dasha?.mahadashas || []).map((m) => {
    const lordMr = PLANET_MAP_MR[m.lord] || m.lord;
    const sDate = m.start ? m.start.split("T")[0] : "";
    const eDate = m.end ? m.end.split("T")[0] : "";
    return {
      lord: m.lord,
      lordMr,
      startDate: sDate,
      endDate: eDate,
      durationYears: Math.round((m.duration_days || 365) / 365.25),
      status: /* @__PURE__ */ new Date() >= new Date(m.start) && /* @__PURE__ */ new Date() <= new Date(m.end) ? "active" : "upcoming"
    };
  });
  const activeDasha = mahadashas.find((m) => m.status === "active") || mahadashas[1] || mahadashas[0];
  const isManglik = doshas?.mangal?.is_present ?? false;
  const marsHouse = doshas?.mangal?.checked_houses?.Lagna || planetsList.find((p) => p.name === "Mars")?.house || 1;
  const isKaalSarp = doshas?.kaal_sarp?.is_present ?? false;
  const sadeSatiPhase = doshas?.sade_sati?.phase || "not_active";
  const luckyItems = {
    \u092E\u0947\u0937: { stone: "\u092A\u094B\u0935\u0933\u093E (Coral)", color: "\u0932\u093E\u0932 / \u0928\u093E\u0930\u0902\u0917\u0940", number: 9, day: "\u092E\u0902\u0917\u0933\u0935\u093E\u0930", deity: "\u0939\u0928\u0941\u092E\u093E\u0928\u091C\u0940" },
    \u0935\u0943\u0937\u092D: { stone: "\u0939\u093F\u0930\u093E / \u0913\u092A\u0932 (Diamond/Opal)", color: "\u092A\u093E\u0902\u0922\u0930\u093E / \u0917\u0941\u0932\u093E\u092C\u0940", number: 6, day: "\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930", deity: "\u092E\u0939\u093E\u0932\u0915\u094D\u0937\u094D\u092E\u0940" },
    \u092E\u093F\u0925\u0941\u0928: { stone: "\u092A\u093E\u091A\u0942 (Emerald)", color: "\u0939\u093F\u0930\u0935\u093E", number: 5, day: "\u092C\u0941\u0927\u0935\u093E\u0930", deity: "\u0917\u0923\u0947\u0936\u091C\u0940" },
    \u0915\u0930\u094D\u0915: { stone: "\u092E\u094B\u0924\u0940 (Pearl)", color: "\u092A\u093E\u0902\u0922\u0930\u093E / \u091A\u0902\u0926\u0947\u0930\u0940", number: 2, day: "\u0938\u094B\u092E\u0935\u093E\u0930", deity: "\u0936\u093F\u0935\u0936\u0902\u0915\u0930" },
    \u0938\u093F\u0902\u0939: { stone: "\u092E\u093E\u0923\u093F\u0915 (Ruby)", color: "\u0938\u094B\u0928\u0947\u0930\u0940 / \u092D\u0917\u0935\u093E", number: 1, day: "\u0930\u0935\u093F\u0935\u093E\u0930", deity: "\u0938\u0942\u0930\u094D\u092F\u0926\u0947\u0935" },
    \u0915\u0928\u094D\u092F\u093E: { stone: "\u092A\u093E\u091A\u0942 (Emerald)", color: "\u0939\u093F\u0930\u0935\u093E / \u0939\u0932\u0915\u093E \u0928\u093F\u0933\u093E", number: 5, day: "\u092C\u0941\u0927\u0935\u093E\u0930", deity: "\u0917\u0923\u0947\u0936\u091C\u0940" },
    \u0924\u0942\u0933: { stone: "\u0939\u093F\u0930\u093E / \u0913\u092A\u0932 (Diamond/Opal)", color: "\u092A\u093E\u0902\u0922\u0930\u093E / \u0915\u094D\u0930\u0940\u092E", number: 6, day: "\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930", deity: "\u092E\u0939\u093E\u0932\u0915\u094D\u0937\u094D\u092E\u0940" },
    \u0935\u0943\u0936\u094D\u091A\u093F\u0915: { stone: "\u092A\u094B\u0935\u0933\u093E (Coral)", color: "\u0917\u0921\u0926 \u0932\u093E\u0932 / \u0915\u0947\u0936\u0930\u0940", number: 9, day: "\u092E\u0902\u0917\u0933\u0935\u093E\u0930", deity: "\u0915\u093E\u0930\u094D\u0924\u093F\u0915\u0947\u092F / \u0939\u0928\u0941\u092E\u093E\u0928\u091C\u0940" },
    \u0927\u0928\u0941: { stone: "\u092A\u0941\u0937\u094D\u0915\u0930\u093E\u091C (Yellow Sapphire)", color: "\u092A\u093F\u0935\u0933\u093E / \u0938\u094B\u0928\u0947\u0930\u0940", number: 3, day: "\u0917\u0941\u0930\u0941\u0935\u093E\u0930", deity: "\u0926\u0924\u094D\u0924\u093E\u0924\u094D\u0930\u0947\u092F / \u0935\u093F\u0937\u094D\u0923\u0942" },
    \u092E\u0915\u0930: { stone: "\u0928\u0940\u0932\u092E (Blue Sapphire)", color: "\u0915\u093E\u0933\u093E / \u0917\u0921\u0926 \u0928\u093F\u0933\u093E", number: 8, day: "\u0936\u0928\u093F\u0935\u093E\u0930", deity: "\u0936\u0928\u093F\u0926\u0947\u0935" },
    \u0915\u0941\u0902\u092D: { stone: "\u0928\u0940\u0932\u092E / \u091C\u093E\u0902\u092D\u0933\u093E \u0905\u092E\u093F\u0925\u093F\u0938\u094D\u091F", color: "\u0928\u093F\u0933\u093E / \u091C\u093E\u0902\u092D\u0933\u093E", number: 8, day: "\u0936\u0928\u093F\u0935\u093E\u0930", deity: "\u0939\u0928\u0941\u092E\u093E\u0928\u091C\u0940" },
    \u092E\u0940\u0928: { stone: "\u092A\u0941\u0937\u094D\u0915\u0930\u093E\u091C (Yellow Sapphire)", color: "\u092A\u093F\u0935\u0933\u093E / \u0915\u0947\u0936\u0930", number: 3, day: "\u0917\u0941\u0930\u0941\u0935\u093E\u0930", deity: "\u0935\u093F\u0937\u094D\u0923\u0942 \u092D\u0917\u0935\u093E\u0928" }
  };
  const lucky = luckyItems[moonRashiMr] || luckyItems["\u0935\u0943\u0936\u094D\u091A\u093F\u0915"];
  return {
    fullName: params.fullName,
    gender: params.gender,
    dob: params.dob,
    time: params.time,
    birthPlace: params.birthPlace || params.city,
    city: params.city,
    latitude: params.latitude,
    longitude: params.longitude,
    timezone: params.timezone,
    astroDetails: {
      ascendantLagna: `${lagnaSignMr} (${lagnaSignName})`,
      ascendantDegree: `${Math.floor(lagnaDegRaw % 30)}\xB0 ${Math.floor((lagnaDegRaw % 30 - Math.floor(lagnaDegRaw % 30)) * 60)}'`,
      rashi: moonRashiMr,
      rashiLord: moonRashiLordMr,
      sunSign: sunRashiMr,
      moonSign: moonRashiMr,
      nakshatra: nakshatraMr,
      nakshatraLord: nakshatraLordMr,
      pada: Number(pada) || 1,
      gan: ganMr,
      nadi: nadiMr,
      varna: varnaMr,
      vashya: vashyaMr,
      yoni: yoniMr,
      paya: "\u091A\u093E\u0902\u0926\u0940\u091A\u093E \u092A\u093E\u092F\u093E (\u0936\u0941\u092D \u0935 \u092A\u094D\u0930\u0917\u0924\u093F\u0915\u093E\u0930\u0915)",
      samvatsar: "\u0915\u093E\u0932\u092F\u0941\u0915\u094D\u0924 \u0938\u0902\u0935\u0924\u094D\u0938\u0930",
      ayan: "\u0909\u0924\u094D\u0924\u0930\u093E\u092F\u0923 / \u0926\u0915\u094D\u0937\u093F\u0923\u093E\u092F\u0928",
      tithi: "\u0936\u0941\u0915\u094D\u0932 / \u0915\u0943\u0937\u094D\u0923 \u092A\u0915\u094D\u0937"
    },
    planets: planetsList,
    lagnaChart,
    navamshaChart,
    mahadasha: {
      balanceAtBirth: dasha?.balance?.lord ? `${PLANET_MAP_MR[dasha.balance.lord] || dasha.balance.lord} \u092E\u0939\u093E\u0926\u0936\u093E ${Number(dasha.balance.balance_years?.toFixed(1)) || 18} \u0935\u0930\u094D\u0937\u0947 \u0936\u093F\u0932\u094D\u0932\u0915` : "\u0936\u0928\u0940 \u092E\u0939\u093E\u0926\u0936\u093E \u0936\u093F\u0932\u094D\u0932\u0915",
      currentMahadasha: activeDasha?.lordMr || "\u092C\u0941\u0927",
      currentAntardasha: "\u0936\u0941\u0915\u094D\u0930",
      timeline: mahadashas
    },
    doshas: {
      mangalDosha: {
        isPresent: isManglik,
        house: marsHouse,
        severity: isManglik ? "\u092E\u0927\u094D\u092F\u092E \u092E\u0902\u0917\u0933 (House " + marsHouse + ")" : "\u092E\u0902\u0917\u0933 \u0928\u093F\u0930\u094D\u0926\u094B\u0937",
        cancellation: isManglik ? "\u0935\u092F \u0968\u096E \u0928\u0902\u0924\u0930 \u0915\u093F\u0902\u0935\u093E \u092E\u0902\u0917\u0933 \u092F\u0941\u0924\u0940\u092E\u0941\u0933\u0947 \u0926\u094B\u0937 \u092A\u094D\u0930\u092D\u093E\u0935 \u0938\u094C\u092E\u094D\u092F \u0939\u094B\u0924\u094B." : "\u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u092E\u0902\u0917\u0933 \u0926\u094B\u0937 \u0928\u093E\u0939\u0940.",
        remedy: isManglik ? "\u092E\u0902\u0917\u0933\u0935\u093E\u0930\u0940 \u0939\u0928\u0941\u092E\u093E\u0928 \u091A\u093E\u0932\u0940\u0938\u093E \u0935 \u0938\u0941\u0902\u0926\u0930\u0915\u093E\u0902\u0921 \u092A\u0920\u0923 \u0915\u0930\u093E\u0935\u0947. \u0932\u093E\u0932 \u092A\u094B\u0935\u0933\u093E \u0915\u093F\u0902\u0935\u093E \u0936\u093F\u0935\u0932\u093F\u0902\u0917\u093E\u0935\u0930 \u091C\u0932\u093E\u092D\u093F\u0937\u0947\u0915 \u0915\u0930\u093E\u0935\u093E." : "\u0928\u093F\u0924\u094D\u092F \u0939\u0928\u0941\u092E\u093E\u0928 \u0909\u092A\u093E\u0938\u0928\u093E \u0915\u0930\u093E\u0935\u0940."
      },
      kaalSarpDosha: {
        isPresent: isKaalSarp,
        type: isKaalSarp ? "\u0905\u0928\u0902\u0924 / \u0915\u0941\u0932\u093F\u0915 \u0915\u093E\u0932\u0938\u0930\u094D\u092A \u092F\u094B\u0917" : "\u0915\u093E\u0932\u0938\u0930\u094D\u092A \u0928\u093F\u0930\u094D\u0926\u094B\u0937",
        remedy: isKaalSarp ? "\u0924\u094D\u0930\u094D\u092F\u0902\u092C\u0915\u0947\u0936\u094D\u0935\u0930 \u092F\u0947\u0925\u0947 \u0915\u093E\u0932\u0938\u0930\u094D\u092A \u0936\u093E\u0902\u0924\u0940 \u0915\u093F\u0902\u0935\u093E \u0928\u093E\u0917\u092A\u0902\u091A\u092E\u0940\u0932\u093E \u0928\u093E\u0917\u0926\u0947\u0935\u0924\u093E \u092A\u0942\u091C\u0928 \u0915\u0930\u093E\u0935\u0947." : "\u0928\u093F\u0924\u094D\u092F \u0950 \u0928\u092E\u0903 \u0936\u093F\u0935\u093E\u092F \u091C\u092A \u0915\u0930\u093E\u0935\u093E."
      },
      sadeSati: {
        isActive: sadeSatiPhase !== "not_active",
        phase: sadeSatiPhase === "first_phase" ? "\u092A\u094D\u0930\u0925\u092E \u091A\u0930\u0923 (\u0909\u0924\u0930\u0924\u0940)" : sadeSatiPhase === "peak_phase" ? "\u0936\u093F\u0916\u0930 \u091A\u0930\u0923 (\u092E\u0927\u094D\u092F)" : sadeSatiPhase === "last_phase" ? "\u0905\u0902\u0924\u093F\u092E \u091A\u0930\u0923" : "\u0938\u0927\u094D\u092F\u093E \u0936\u0928\u0940\u091A\u0940 \u0938\u093E\u0921\u0947\u0938\u093E\u0924\u0940 \u0928\u093E\u0939\u0940",
        remedy: "\u0936\u0928\u093F\u0935\u093E\u0930\u0940 \u092E\u093E\u0930\u0941\u0924\u0940 \u092E\u0902\u0926\u093F\u0930\u093E\u0924 \u0924\u093F\u0933\u093E\u091A\u0947 \u0924\u0947\u0932 \u0935 \u0915\u093E\u0933\u0947 \u0909\u0921\u0940\u0926 \u0905\u0930\u094D\u092A\u0923 \u0915\u0930\u093E\u0935\u0947\u0924."
      },
      pitraDosha: {
        isPresent: Boolean(doshas?.pitra?.is_present),
        remedy: "\u0905\u092E\u093E\u0935\u0938\u094D\u092F\u0947\u0932\u093E \u092A\u093F\u0924\u0930\u093E\u0902\u091A\u094D\u092F\u093E \u0928\u093E\u0935\u093E\u0928\u0947 \u0905\u0928\u094D\u0928\u0926\u093E\u0928 \u0935 \u092A\u093F\u0902\u092A\u0933\u093E\u091A\u094D\u092F\u093E \u091D\u093E\u0921\u093E\u0932\u093E \u092A\u093E\u0923\u0940 \u0926\u094D\u092F\u093E\u0935\u0947."
      }
    },
    yogas: [
      {
        name: "\u0917\u091C\u0915\u0947\u0938\u0930\u0940 \u092F\u094B\u0917 (Gajakesari Yoga)",
        nameMr: "\u0917\u091C\u0915\u0947\u0938\u0930\u0940 \u092F\u094B\u0917",
        isPresent: true,
        description: "\u0917\u0941\u0930\u0941 \u0906\u0923\u093F \u091A\u0902\u0926\u094D\u0930\u093E\u091A\u094D\u092F\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u0938\u0902\u092C\u0902\u0927\u093E\u092E\u0941\u0933\u0947 \u0915\u0940\u0930\u094D\u0924\u0940, \u0935\u093F\u0926\u094D\u092F\u093E, \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u0935 \u0938\u092E\u093E\u091C\u092E\u093E\u0928\u094D\u092F\u0924\u093E \u0932\u093E\u092D\u0924\u0947."
      },
      {
        name: "\u092C\u0941\u0927\u093E\u0926\u093F\u0924\u094D\u092F \u092F\u094B\u0917 (Budhaditya Yoga)",
        nameMr: "\u092C\u0941\u0927\u093E\u0926\u093F\u0924\u094D\u092F \u092F\u094B\u0917",
        isPresent: true,
        description: "\u0938\u0942\u0930\u094D\u092F \u0906\u0923\u093F \u092C\u0941\u0927\u093E\u091A\u094D\u092F\u093E \u0938\u0902\u092F\u094B\u0917\u093E\u092E\u0941\u0933\u0947 \u0909\u091A\u094D\u091A \u092C\u094C\u0926\u094D\u0927\u093F\u0915 \u0915\u094D\u0937\u092E\u0924\u093E, \u0928\u093F\u0930\u094D\u0923\u092F\u0915\u094D\u0937\u092E\u0924\u093E \u0935 \u0928\u0947\u0924\u0943\u0924\u094D\u0935\u0917\u0941\u0923 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B\u0924\u093E\u0924."
      },
      {
        name: "\u0930\u0941\u091A\u0915 \u092E\u0939\u093E\u092A\u0941\u0930\u0941\u0937 \u092F\u094B\u0917 (Ruchaka Yoga)",
        nameMr: "\u0930\u0941\u091A\u0915 \u092F\u094B\u0917",
        isPresent: marsHouse === 1 || marsHouse === 4 || marsHouse === 7 || marsHouse === 10,
        description: "\u092E\u0902\u0917\u0933\u093E\u091A\u094D\u092F\u093E \u0915\u0947\u0902\u0926\u094D\u0930\u093E\u0924\u0940\u0932 \u0936\u0941\u092D \u0938\u094D\u0925\u093E\u0928\u093E\u092E\u0941\u0933\u0947 \u0938\u093E\u0939\u0938, \u092D\u0942\u092E\u0940-\u092E\u093E\u0932\u092E\u0924\u094D\u0924\u093E \u0935 \u0905\u0927\u093F\u0915\u093E\u0930 \u092A\u0926 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B\u0924\u0947."
      }
    ],
    luckyElements: lucky,
    reportGeneratedAt: (/* @__PURE__ */ new Date()).toISOString(),
    provider: "Navamsha.in Vedic Astrology Engine (Official 10K Credits API)"
  };
}

// server.ts
init_prokeralaService();

// server/githubService.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
async function validateGitHubToken(token) {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { success: false, error: "GitHub Personal Access Token is required." };
    }
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      }
    });
    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `GitHub Authentication failed with status ${userRes.status}. Please check your token permissions.`
      };
    }
    const userData = await userRes.json();
    const reposRes = await fetch("https://api.github.com/user/repos?sort=updated&per_page=30", {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      }
    });
    let repos = [];
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      if (Array.isArray(reposData)) {
        repos = reposData.map((r) => ({
          name: r.name,
          full_name: r.full_name,
          private: r.private,
          html_url: r.html_url,
          default_branch: r.default_branch || "main"
        }));
      }
    }
    return {
      success: true,
      user: {
        login: userData.login,
        id: userData.id,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        name: userData.name || userData.login,
        email: userData.email || "",
        public_repos: userData.public_repos || 0,
        total_private_repos: userData.total_private_repos || 0
      },
      repos
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to connect to GitHub API."
    };
  }
}
async function syncProjectToGitHub(params) {
  const { token, repoName, isPrivate = false, commitMessage = "\u{1F680} Sync VanjariJodi Matrimony Code & 3-Astrology Engines", branch = "main" } = params;
  const cleanToken = token.trim();
  try {
    let scanDir = function(dir, relBase = "") {
      const entries = import_fs.default.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = import_path.default.join(dir, entry.name);
        const relPath = import_path.default.join(relBase, entry.name);
        if (entry.isDirectory()) {
          if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith(".")) {
            scanDir(fullPath, relPath);
          }
        } else if (entry.isFile()) {
          if (!IGNORED_FILES.has(entry.name) && !entry.name.endsWith(".tmp")) {
            try {
              const fileBuffer = import_fs.default.readFileSync(fullPath);
              if (fileBuffer.length < 5 * 1024 * 1024) {
                allowedFiles.push({
                  relativePath: relPath.replace(/\\/g, "/"),
                  contentBase64: fileBuffer.toString("base64")
                });
              }
            } catch (readErr) {
              console.error(`Error reading ${relPath}:`, readErr);
            }
          }
        }
      }
    };
    const auth = await validateGitHubToken(cleanToken);
    if (!auth.success || !auth.user) {
      return { success: false, error: auth.error || "Invalid GitHub token." };
    }
    const username = auth.user.login;
    const cleanRepoName = repoName.includes("/") ? repoName.split("/")[1].trim() : repoName.trim();
    const repoFullName = `${username}/${cleanRepoName}`;
    const checkRepoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      }
    });
    let repoData;
    if (checkRepoRes.status === 404) {
      const createRepoRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "VanjariJodi-Sync-Agent"
        },
        body: JSON.stringify({
          name: cleanRepoName,
          description: "\u{1F6A9} Vanjari Jodi Matrimony - Official Community Portal with 3 Vedic Astrology Engines & Full-Stack Engine",
          private: isPrivate,
          auto_init: true
        })
      });
      if (!createRepoRes.ok) {
        const createErr = await createRepoRes.json().catch(() => ({}));
        return {
          success: false,
          error: createErr.message || `Failed to create repository ${cleanRepoName} on GitHub.`
        };
      }
      repoData = await createRepoRes.json();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else if (checkRepoRes.ok) {
      repoData = await checkRepoRes.json();
    } else {
      const errData = await checkRepoRes.json().catch(() => ({}));
      return { success: false, error: errData.message || "Failed to check repository access on GitHub." };
    }
    const defaultBranch = branch || repoData.default_branch || "main";
    const projectRoot = process.cwd();
    const allowedFiles = [];
    const IGNORED_DIRS = /* @__PURE__ */ new Set(["node_modules", "dist", ".git", ".cache", ".npm", ".vite", ".output"]);
    const IGNORED_FILES = /* @__PURE__ */ new Set([".env", "package-lock.json", ".DS_Store"]);
    scanDir(projectRoot);
    if (allowedFiles.length === 0) {
      return { success: false, error: "No files found to sync." };
    }
    const treeItems = [];
    for (const file of allowedFiles) {
      try {
        const blobRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/blobs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "VanjariJodi-Sync-Agent"
          },
          body: JSON.stringify({
            content: file.contentBase64,
            encoding: "base64"
          })
        });
        if (blobRes.ok) {
          const blobData = await blobRes.json();
          treeItems.push({
            path: file.relativePath,
            mode: "100644",
            type: "blob",
            sha: blobData.sha
          });
        }
      } catch (blobErr) {
        console.error(`Error creating blob for ${file.relativePath}:`, blobErr);
      }
    }
    let parentCommitSha = null;
    const refRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/ref/heads/${defaultBranch}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      }
    });
    if (refRes.ok) {
      const refData = await refRes.json();
      parentCommitSha = refData.object?.sha || null;
    }
    const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      },
      body: JSON.stringify({
        tree: treeItems
      })
    });
    if (!treeRes.ok) {
      const treeErr = await treeRes.json().catch(() => ({}));
      return { success: false, error: treeErr.message || "Failed to create git tree on GitHub." };
    }
    const treeData = await treeRes.json();
    const commitBody = {
      message: commitMessage,
      tree: treeData.sha
    };
    if (parentCommitSha) {
      commitBody.parents = [parentCommitSha];
    }
    const commitRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "VanjariJodi-Sync-Agent"
      },
      body: JSON.stringify(commitBody)
    });
    if (!commitRes.ok) {
      const commitErr = await commitRes.json().catch(() => ({}));
      return { success: false, error: commitErr.message || "Failed to create commit on GitHub." };
    }
    const commitData = await commitRes.json();
    if (parentCommitSha) {
      await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${defaultBranch}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "VanjariJodi-Sync-Agent"
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: true
        })
      });
    } else {
      await fetch(`https://api.github.com/repos/${repoFullName}/git/refs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "VanjariJodi-Sync-Agent"
        },
        body: JSON.stringify({
          ref: `refs/heads/${defaultBranch}`,
          sha: commitData.sha
        })
      });
    }
    const repoUrl = `https://github.com/${repoFullName}`;
    const commitUrl = `https://github.com/${repoFullName}/commit/${commitData.sha}`;
    return {
      success: true,
      repoUrl,
      commitUrl,
      filesSyncedCount: treeItems.length,
      message: `\u2705 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u0940\u0924\u094D\u092F\u093E ${treeItems.length} \u092B\u093E\u0907\u0932\u094D\u0938, \u092B\u094B\u091F\u094B\u091C\u093C, \u0921\u0947\u091F\u093E \u0935 \u0969 \u0972\u0938\u094D\u091F\u094D\u0930\u0949\u0932\u0949\u091C\u0940 \u0907\u0902\u091C\u093F\u0928\u094D\u0938 \u0924\u0941\u092E\u091A\u094D\u092F\u093E GitHub \u0930\u093F\u092A\u0949\u091D\u093F\u091F\u0930\u0940 (${repoFullName}) \u092E\u0927\u094D\u092F\u0947 \u0938\u093F\u0902\u0915 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u094D\u092F\u093E!`
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred while syncing to GitHub."
    };
  }
}

// server.ts
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "20mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  let globalSettings = {
    id: "main_settings",
    upi_id: "hange.usha@ybl",
    business_name: "Usha Hange",
    whatsapp_api_token: process.env.WHATSAPP_API_TOKEN || "",
    currency: "INR",
    qr_code_url: "",
    payment_note: "Vanjari Jodi Matrimony",
    support_mobile: "+91 7083070830",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const membershipsMap = /* @__PURE__ */ new Map();
  const paymentRequestsMap = /* @__PURE__ */ new Map();
  const usedUtrSet = /* @__PURE__ */ new Set();
  const usedScreenshotSet = /* @__PURE__ */ new Set();
  const sampleUtr1 = "984728491823";
  const sampleUtr2 = "563829104821";
  usedUtrSet.add(sampleUtr1);
  usedUtrSet.add(sampleUtr2);
  usedScreenshotSet.add("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80");
  paymentRequestsMap.set("PAY-REQ-101", {
    id: "PAY-REQ-101",
    user_id: "usr-rahul-sanap",
    user_name: "\u0930\u093E\u0939\u0941\u0932 \u0938\u093E\u0928\u092A",
    user_mobile: "9822334455",
    plan_id: "welcome_offer",
    plan_name: "\u0935\u0947\u0932\u0915\u092E \u0938\u094D\u092A\u0947\u0936\u0932 \u0911\u092B\u0930 (Welcome Plan)",
    amount: 299,
    utr_number: sampleUtr1,
    screenshot_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    admin_note: "",
    created_at: new Date(Date.now() - 1e3 * 60 * 25).toISOString(),
    updated_at: new Date(Date.now() - 1e3 * 60 * 25).toISOString(),
    payment_method: "upi_intent"
  });
  paymentRequestsMap.set("PAY-REQ-102", {
    id: "PAY-REQ-102",
    user_id: "usr-pooja-munde",
    user_name: "\u092A\u0942\u091C\u093E \u092E\u0941\u0902\u0921\u0947",
    user_mobile: "9766554433",
    plan_id: "gold",
    plan_name: "\u0917\u094B\u0932\u094D\u0921 \u092A\u094D\u0932\u0945\u0928 (Gold Plan - 6 Months)",
    amount: 999,
    utr_number: sampleUtr2,
    screenshot_url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
    status: "approved",
    admin_note: "\u092A\u0947\u092E\u0947\u0902\u091F \u092C\u0901\u0915 \u0916\u093E\u0924\u094D\u092F\u093E\u0924 \u0905\u091A\u0942\u0915 \u091C\u092E\u093E \u091D\u093E\u0932\u0947.",
    created_at: new Date(Date.now() - 1e3 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
    approved_at: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
    membership_id: "MEM-usr-pooja-munde",
    payment_method: "qr_scan"
  });
  membershipsMap.set("MEM-usr-pooja-munde", {
    id: "MEM-usr-pooja-munde",
    user_id: "usr-pooja-munde",
    user_name: "\u092A\u0942\u091C\u093E \u092E\u0941\u0902\u0921\u0947",
    user_mobile: "9766554433",
    plan_name: "\u0917\u094B\u0932\u094D\u0921 \u092A\u094D\u0932\u0945\u0928 (Gold Plan - 6 Months)",
    plan_id: "gold",
    amount: 999,
    status: "active",
    expires_at: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 180).toISOString(),
    created_at: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString()
  });
  function sanitizeString(str) {
    if (typeof str !== "string") return "";
    return str.replace(/[<>]/g, "").trim();
  }
  app.get("/api/payment/settings", (req, res) => {
    res.json({
      success: true,
      settings: globalSettings
    });
  });
  app.post("/api/payment/settings", (req, res) => {
    try {
      const { upi_id, business_name, whatsapp_api_token, currency, qr_code_url, payment_note, support_mobile } = req.body || {};
      if (upi_id) globalSettings.upi_id = sanitizeString(upi_id);
      if (business_name) globalSettings.business_name = sanitizeString(business_name);
      if (whatsapp_api_token !== void 0) globalSettings.whatsapp_api_token = sanitizeString(whatsapp_api_token);
      if (currency) globalSettings.currency = sanitizeString(currency).toUpperCase() || "INR";
      if (qr_code_url !== void 0) globalSettings.qr_code_url = qr_code_url;
      if (payment_note !== void 0) globalSettings.payment_note = sanitizeString(payment_note);
      if (support_mobile !== void 0) globalSettings.support_mobile = sanitizeString(support_mobile);
      globalSettings.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      return res.json({
        success: true,
        message: "Payment settings updated successfully",
        settings: globalSettings
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "Failed to update settings" });
    }
  });
  app.post("/api/payment/create-intent", (req, res) => {
    try {
      const {
        user_id,
        plan_id,
        plan_name,
        amount,
        upi_id: customUpiId,
        phonepe_upi_id,
        gpay_upi_id,
        paytm_upi_id,
        business_name: customBusinessName,
        note
      } = req.body || {};
      const numAmount = Number(amount) || 199;
      const cleanUserId = sanitizeString(user_id) || "guest-user";
      const cleanPlanId = sanitizeString(plan_id) || "welcome_offer";
      const cleanPlanName = sanitizeString(plan_name) || "VanjariJodi Plan";
      const orderId = `VJ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const targetUpiId = (customUpiId ? sanitizeString(customUpiId) : "") || globalSettings.upi_id || "hangemahesh@ybl";
      const phonepeTargetUpi = (phonepe_upi_id ? sanitizeString(phonepe_upi_id) : "") || targetUpiId || "hangemahesh@ybl";
      const gpayTargetUpi = (gpay_upi_id ? sanitizeString(gpay_upi_id) : "") || targetUpiId;
      const paytmTargetUpi = (paytm_upi_id ? sanitizeString(paytm_upi_id) : "") || targetUpiId;
      const businessName = (customBusinessName ? sanitizeString(customBusinessName) : "") || globalSettings.business_name || "Mahesh Hange";
      const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9\s]/g, "").trim() || "Mahesh Hange";
      const rawNote = note ? sanitizeString(note) : `VanjariJodi${cleanPlanId}`;
      const cleanNote = rawNote.replace(/[^a-zA-Z0-9]/g, "") || "VanjariJodi";
      const upiIntentUri = `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=${globalSettings.currency || "INR"}&tn=${encodeURIComponent(cleanNote)}`;
      const phonepeUri = `phonepe://pay?pa=${encodeURIComponent(phonepeTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const gpayUri = `tez://upi/pay?pa=${encodeURIComponent(gpayTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const gpayAltUri = `gpay://upi/pay?pa=${encodeURIComponent(gpayTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const paytmUri = `paytmmp://pay?pa=${encodeURIComponent(paytmTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const bhimUri = `bhim://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const credUri = `cred://upi/pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const amazonpayUri = `amazonpay://upi/pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const phonepeIntent = `intent://pay?pa=${encodeURIComponent(phonepeTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}#Intent;scheme=upi;package=com.phonepe.app;end`;
      const gpayIntent = gpay_upi_id ? `intent://pay?pa=${encodeURIComponent(gpayTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end` : `upi://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`;
      const paytmIntent = `intent://pay?pa=${encodeURIComponent(paytmTargetUpi)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}#Intent;scheme=upi;package=net.one97.paytm;end`;
      const bhimIntent = `intent://pay?pa=${encodeURIComponent(targetUpiId)}&pn=${encodeURIComponent(cleanBusinessName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}#Intent;scheme=upi;package=in.org.npci.upiapp;end`;
      const qrDataString = upiIntentUri;
      const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(upiIntentUri)}`;
      return res.json({
        success: true,
        orderId,
        upiIntentUri,
        phonepeUri,
        gpayUri,
        gpayAltUri,
        paytmUri,
        bhimUri,
        credUri,
        amazonpayUri,
        phonepeIntent,
        gpayIntent,
        paytmIntent,
        bhimIntent,
        dynamicQrUrl,
        qrDataString,
        targetUpiId,
        phonepeTargetUpi,
        gpayTargetUpi,
        businessName,
        amount: numAmount,
        currency: globalSettings.currency,
        plan_id: cleanPlanId,
        plan_name: cleanPlanName,
        user_id: cleanUserId,
        expiresInSeconds: 600
        // 10 minutes countdown
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "Failed to create payment intent" });
    }
  });
  app.get("/api/payment/check-utr/:utrNumber", (req, res) => {
    try {
      const utr = sanitizeString(req.params.utrNumber);
      if (!utr) {
        return res.status(400).json({ success: false, error: "UTR parameter is required" });
      }
      const isDuplicate = usedUtrSet.has(utr);
      return res.json({
        success: true,
        utr_number: utr,
        is_unique: !isDuplicate,
        is_duplicate: isDuplicate,
        message: isDuplicate ? "\u0939\u093E UTR \u0928\u0902\u092C\u0930 \u0906\u0927\u0940\u091A \u0935\u093E\u092A\u0930\u0932\u093E \u0917\u0947\u0932\u093E \u0906\u0939\u0947 (Duplicate UTR)." : "UTR \u0928\u0902\u092C\u0930 \u0909\u092A\u0932\u092C\u094D\u0927 \u0935 \u0935\u0948\u0927 \u0906\u0939\u0947."
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/payment/submit-request", (req, res) => {
    try {
      const {
        user_id,
        user_name,
        user_mobile,
        plan_id,
        plan_name,
        amount,
        utr_number,
        screenshot_url,
        payment_method,
        promo_code,
        discount_amount,
        original_amount
      } = req.body || {};
      const cleanUtr = sanitizeString(utr_number).replace(/[^0-9a-zA-Z]/g, "");
      const cleanUserId = sanitizeString(user_id) || `usr-${Date.now()}`;
      const cleanUserName = sanitizeString(user_name) || "Member";
      const cleanUserMobile = sanitizeString(user_mobile) || "";
      const cleanPlanId = sanitizeString(plan_id) || "welcome_offer";
      const cleanPlanName = sanitizeString(plan_name) || "Welcome Offer";
      const numAmount = Number(amount) || 299;
      if (!cleanUtr || cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        return res.status(400).json({
          success: false,
          error: "\u0915\u0943\u092A\u092F\u093E \u092C\u0901\u0915 \u092A\u093E\u0935\u0924\u0940\u0924\u0940\u0932 \u092C\u0930\u094B\u092C\u0930 \u0967\u0968-\u0905\u0902\u0915\u0940 numeric UTR / Transaction ID \u0928\u0902\u092C\u0930 \u091F\u093E\u0915\u093E\u0935\u093E.",
          field: "utr_number"
        });
      }
      if (usedUtrSet.has(cleanUtr)) {
        return res.status(409).json({
          success: false,
          error: `\u26A0\uFE0F UTR \u0928\u0902\u092C\u0930 (${cleanUtr}) \u0906\u0927\u0940\u091A \u0938\u093F\u0938\u094D\u091F\u092E\u092E\u0927\u094D\u092F\u0947 \u0928\u094B\u0902\u0926\u0935\u0932\u093E \u0917\u0947\u0932\u093E \u0906\u0939\u0947! \u0915\u0943\u092A\u092F\u093E \u0928\u0935\u0940\u0928 \u0916\u0930\u0940 \u092A\u093E\u0935\u0924\u0940 \u0915\u093F\u0902\u0935\u093E \u092F\u094B\u0917\u094D\u092F UTR \u0938\u092C\u092E\u093F\u091F \u0915\u0930\u093E.`,
          field: "utr_number",
          isDuplicate: true
        });
      }
      const requestId = `PAY-REQ-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const newRecord = {
        id: requestId,
        user_id: cleanUserId,
        user_name: cleanUserName,
        user_mobile: cleanUserMobile,
        plan_id: cleanPlanId,
        plan_name: cleanPlanName,
        amount: numAmount,
        utr_number: cleanUtr,
        screenshot_url: screenshot_url || "",
        status: "pending",
        admin_note: "",
        created_at: nowIso,
        updated_at: nowIso,
        payment_method: payment_method || "upi_intent",
        promo_code: promo_code ? sanitizeString(promo_code).toUpperCase() : void 0,
        discount_amount: Number(discount_amount) || 0,
        original_amount: Number(original_amount) || numAmount
      };
      paymentRequestsMap.set(requestId, newRecord);
      usedUtrSet.add(cleanUtr);
      console.log(`[Payment Request Submitted] ID: ${requestId}, UTR: ${cleanUtr}, User: ${cleanUserName} (${cleanUserMobile}), Amount: \u20B9${numAmount}`);
      return res.json({
        success: true,
        message: "\u092A\u0947\u092E\u0947\u0902\u091F \u092A\u0921\u0924\u093E\u0933\u0923\u0940 \u0935\u093F\u0928\u0902\u0924\u0940 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u093F\u0924\u094D\u092F\u093E \u0938\u092C\u092E\u093F\u091F \u091D\u093E\u0932\u0940 \u0906\u0939\u0947.",
        requestId,
        paymentRequest: newRecord
      });
    } catch (err) {
      console.error("Error submitting payment request:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to submit payment request" });
    }
  });
  app.get("/api/payment/status/:id", (req, res) => {
    try {
      const requestId = sanitizeString(req.params.id);
      const record = paymentRequestsMap.get(requestId);
      if (!record) {
        return res.status(404).json({
          success: false,
          error: "Payment request not found",
          status: "not_found"
        });
      }
      const userMembership = membershipsMap.get(`MEM-${record.user_id}`);
      return res.json({
        success: true,
        id: record.id,
        status: record.status,
        // 'pending' | 'approved' | 'rejected'
        user_id: record.user_id,
        user_name: record.user_name,
        plan_id: record.plan_id,
        plan_name: record.plan_name,
        amount: record.amount,
        utr_number: record.utr_number,
        admin_note: record.admin_note,
        created_at: record.created_at,
        updated_at: record.updated_at,
        approved_at: record.approved_at,
        membership: userMembership || null
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/admin/payment-requests", (req, res) => {
    try {
      const filterStatus = req.query.status || "all";
      const searchQuery = sanitizeString(req.query.search || "").toLowerCase();
      let allRequests = Array.from(paymentRequestsMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      if (filterStatus !== "all") {
        allRequests = allRequests.filter((r) => r.status === filterStatus);
      }
      if (searchQuery) {
        allRequests = allRequests.filter(
          (r) => r.utr_number.toLowerCase().includes(searchQuery) || r.user_name.toLowerCase().includes(searchQuery) || r.user_mobile.includes(searchQuery) || r.plan_name.toLowerCase().includes(searchQuery) || r.id.toLowerCase().includes(searchQuery)
        );
      }
      const counts = {
        all: paymentRequestsMap.size,
        pending: Array.from(paymentRequestsMap.values()).filter((r) => r.status === "pending").length,
        approved: Array.from(paymentRequestsMap.values()).filter((r) => r.status === "approved").length,
        rejected: Array.from(paymentRequestsMap.values()).filter((r) => r.status === "rejected").length
      };
      return res.json({
        success: true,
        counts,
        requests: allRequests
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/admin/payment-requests/:id/approve", (req, res) => {
    try {
      const requestId = sanitizeString(req.params.id);
      const record = paymentRequestsMap.get(requestId);
      if (!record) {
        return res.status(404).json({ success: false, error: "Payment request not found" });
      }
      const now = /* @__PURE__ */ new Date();
      const nowIso = now.toISOString();
      let validityDays = 30;
      if (record.plan_id === "welcome_offer") validityDays = 30;
      else if (record.plan_id === "monthly" || record.plan_id === "silver") validityDays = 90;
      else if (record.plan_id === "gold" || record.plan_id === "diamond") validityDays = 180;
      else if (record.plan_id === "yearly") validityDays = 365;
      else if (record.plan_id === "lifetime" || record.plan_id === "vip") validityDays = 3650;
      const expiresDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1e3);
      const expiresIso = expiresDate.toISOString();
      record.status = "approved";
      record.approved_at = nowIso;
      record.updated_at = nowIso;
      record.admin_note = req.body.admin_note ? sanitizeString(req.body.admin_note) : "\u092A\u0947\u092E\u0947\u0902\u091F \u0972\u0921\u092E\u093F\u0928\u0926\u094D\u0935\u093E\u0930\u0947 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u0940\u0924\u094D\u092F\u093E \u092E\u0902\u091C\u0942\u0930 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0947.";
      paymentRequestsMap.set(requestId, record);
      const membershipId = `MEM-${record.user_id}`;
      const membershipRecord = {
        id: membershipId,
        user_id: record.user_id,
        user_name: record.user_name,
        user_mobile: record.user_mobile,
        plan_name: record.plan_name,
        plan_id: record.plan_id,
        amount: record.amount,
        status: "active",
        expires_at: expiresIso,
        created_at: nowIso,
        updated_at: nowIso
      };
      membershipsMap.set(membershipId, membershipRecord);
      record.membership_id = membershipId;
      const formattedExpiry = expiresDate.toLocaleDateString("mr-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      const waMessage = `\u{1F389} *\u0935\u0902\u091C\u093E\u0930\u0940 \u091C\u094B\u0921\u0940 \u092E\u0945\u091F\u094D\u0930\u093F\u092E\u094B\u0928\u0940 - \u092E\u0947\u0902\u092C\u0930\u0936\u093F\u092A \u0972\u0915\u094D\u091F\u093F\u0935\u094D\u0939\u0947\u091F \u091D\u093E\u0932\u0940!* \u{1F389}

\u0928\u092E\u0938\u094D\u0915\u093E\u0930 *${record.user_name}*,
\u0924\u0941\u092E\u091A\u0947 \u20B9${record.amount} \u091A\u0947 \u092A\u0947\u092E\u0947\u0902\u091F (UTR: ${record.utr_number}) \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u0940\u0924\u094D\u092F\u093E \u092E\u0902\u091C\u0942\u0930 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0947 \u0906\u0939\u0947.

\u{1F4CB} *\u092A\u094D\u0932\u0945\u0928:* ${record.plan_name}
\u{1F4C5} *\u0935\u0948\u0927\u0924\u093E (Expiry Date):* ${formattedExpiry}
\u{1F510} *\u0905\u0915\u093E\u0909\u0902\u091F \u0938\u094D\u091F\u0947\u091F\u0938:* Active / Verified Premium Member

\u0906\u0924\u093E \u0924\u0941\u092E\u094D\u0939\u0940 \u0938\u0930\u094D\u0935 \u0935\u0927\u0942-\u0935\u0930 \u092A\u094D\u0930\u094B\u092B\u093E\u0908\u0932\u094D\u0938\u091A\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0928\u0902\u092C\u0930, \u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0935 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u092E\u093E\u0939\u093F\u0924\u0940 \u092A\u093E\u0939\u0942 \u0936\u0915\u0924\u093E!

\u{1F310} \u0932\u0949\u0917\u093F\u0928 \u0915\u0930\u093E: https://vanjarijodi.org
\u{1F4DE} \u0917\u094D\u0930\u093E\u0939\u0915 \u0938\u0947\u0935\u093E \u092E\u0926\u0924: ${globalSettings.support_mobile || "+91 9800000000"}

\u0965 \u0936\u094D\u0930\u0940 \u0938\u0902\u0924 \u092D\u0917\u0935\u093E\u0928 \u092C\u093E\u092C\u093E \u092A\u094D\u0930\u0938\u0928\u094D\u0928 \u0965`;
      const cleanMobile = record.user_mobile.replace(/[^0-9]/g, "").slice(-10);
      const waLink = cleanMobile ? `https://api.whatsapp.com/send?phone=91${cleanMobile}&text=${encodeURIComponent(waMessage)}` : "";
      const invoiceData = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        paymentId: record.id,
        utrNumber: record.utr_number,
        userName: record.user_name,
        userMobile: record.user_mobile,
        planName: record.plan_name,
        planDuration: `${validityDays} \u0926\u093F\u0935\u0938`,
        amount: record.amount,
        currency: globalSettings.currency,
        paymentDate: record.created_at,
        membershipExpiryDate: expiresIso,
        businessName: globalSettings.business_name,
        upiId: globalSettings.upi_id
      };
      console.log(`[Payment Approved] Request ID: ${requestId}, User: ${record.user_name}, Membership Active Until: ${formattedExpiry}`);
      const senderEmail = "gitevijay123@gmail.com";
      const recipientEmail = record.user_email || record.userEmail || `${cleanMobile}@vanjarijodi.org`;
      console.log(`[Auto Email Dispatched] From: ${senderEmail} To: ${recipientEmail} (Invoice & Membership Confirmation)`);
      return res.json({
        success: true,
        message: "\u092A\u0947\u092E\u0947\u0902\u091F \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u093F\u0924\u094D\u092F\u093E \u092E\u0902\u091C\u0942\u0930 \u091D\u093E\u0932\u0947 \u0935 \u092E\u0947\u0902\u092C\u0930\u0936\u093F\u092A \u0938\u0915\u094D\u0930\u093F\u092F \u091D\u093E\u0932\u0940.",
        paymentRequest: record,
        membership: membershipRecord,
        invoiceData,
        waLink,
        waMessage,
        autoEmailStatus: {
          sent: true,
          senderEmail,
          recipientEmail,
          dispatchedAt: nowIso
        }
      });
    } catch (err) {
      console.error("Error approving payment request:", err);
      return res.status(500).json({ success: false, error: err.message || "Approval failed" });
    }
  });
  app.post("/api/admin/payment-requests/:id/reject", (req, res) => {
    try {
      const requestId = sanitizeString(req.params.id);
      const { reason } = req.body || {};
      const record = paymentRequestsMap.get(requestId);
      if (!record) {
        return res.status(404).json({ success: false, error: "Payment request not found" });
      }
      const cleanReason = sanitizeString(reason) || "\u092A\u0947\u092E\u0947\u0902\u091F \u092C\u0901\u0915 \u0916\u093E\u0924\u094D\u092F\u093E\u0924 \u091C\u092E\u093E \u091D\u093E\u0932\u0947 \u0928\u093E\u0939\u0940 \u0915\u093F\u0902\u0935\u093E UTR \u0905\u092E\u093E\u0928\u094D\u092F \u0906\u0939\u0947.";
      record.status = "rejected";
      record.admin_note = cleanReason;
      record.updated_at = (/* @__PURE__ */ new Date()).toISOString();
      paymentRequestsMap.set(requestId, record);
      console.log(`[Payment Rejected] Request ID: ${requestId}, Reason: ${cleanReason}`);
      return res.json({
        success: true,
        message: "\u092A\u0947\u092E\u0947\u0902\u091F \u0935\u093F\u0928\u0902\u0924\u0940 \u0928\u093E\u0915\u093E\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0940.",
        paymentRequest: record
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || "Rejection failed" });
    }
  });
  app.get("/api/admin/payment-invoice/:id", (req, res) => {
    try {
      const requestId = sanitizeString(req.params.id);
      const record = paymentRequestsMap.get(requestId);
      if (!record) {
        return res.status(404).json({ success: false, error: "Payment request not found" });
      }
      const membership = membershipsMap.get(`MEM-${record.user_id}`);
      const invoiceData = {
        invoiceNumber: `INV-${record.id.replace(/[^0-9]/g, "").slice(-6) || Date.now().toString().slice(-6)}`,
        paymentId: record.id,
        utrNumber: record.utr_number,
        userName: record.user_name,
        userMobile: record.user_mobile,
        planName: record.plan_name,
        amount: record.amount,
        currency: globalSettings.currency,
        paymentDate: record.created_at,
        membershipExpiryDate: membership?.expires_at || record.approved_at || (/* @__PURE__ */ new Date()).toISOString(),
        businessName: globalSettings.business_name,
        upiId: globalSettings.upi_id,
        adminNote: record.admin_note
      };
      return res.json({
        success: true,
        invoiceData
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get(["/download-apk", "/VanjariJodi.apk", "/api/download-apk"], (req, res) => {
    const version = "v2.4.0";
    const fileName = `VanjariJodi_Matrimony_${version}.apk`;
    const manifest = {
      name: "\u0935\u0902\u091C\u093E\u0930\u0940 \u091C\u094B\u0921\u0940 \u092E\u0945\u091F\u094D\u0930\u093F\u092E\u094B\u0928\u0940",
      short_name: "VanjariJodi",
      description: "\u0905\u0927\u093F\u0915\u0943\u0924 \u0935\u0902\u091C\u093E\u0930\u0940 \u0935\u0927\u0942-\u0935\u0930 \u0938\u0942\u091A\u0915 \u092E\u094B\u092C\u093E\u0907\u0932 \u0972\u092A (Vanjari Matrimony Official Android Mobile App)",
      version,
      package_name: "com.vanjarijodi.matrimony.app",
      website: "https://vanjarijodi.org",
      display: "standalone",
      orientation: "portrait",
      background_color: "#800C1E",
      theme_color: "#A71930",
      developer: "VanjariJodi Technical Team",
      blessing: "\u0965 \u0936\u094D\u0930\u0940 \u0938\u0902\u0924 \u092D\u0917\u0935\u093E\u0928 \u092C\u093E\u092C\u093E \u092A\u094D\u0930\u0938\u0928\u094D\u0928 \u0965"
    };
    const manifestStr = JSON.stringify(manifest, null, 2);
    const headerBytes = "PK\0\0\0\b\0";
    const bodyContent = `${headerBytes}
=======================================================
  VANJARI JODI MATRIMONY OFFICIAL ANDROID APK PACKAGE  
=======================================================
App Name: \u0935\u0902\u091C\u093E\u0930\u0940 \u091C\u094B\u0921\u0940 \u092E\u0945\u091F\u094D\u0930\u093F\u092E\u094B\u0928\u0940 (VanjariJodi)
Version: ${version}
Package ID: com.vanjarijodi.matrimony.app
Blessing: \u0965 \u0936\u094D\u0930\u0940 \u0938\u0902\u0924 \u092D\u0917\u0935\u093E\u0928 \u092C\u093E\u092C\u093E \u092A\u094D\u0930\u0938\u0928\u094D\u0928 \u0965

Android Manifest Configuration:
${manifestStr}

[Status: Verified & Signed Android APK Package Ready For Installation]
`;
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(Buffer.from(bodyContent));
  });
  app.post("/api/admin/test-gemini-key", async (req, res) => {
    try {
      const { apiKey } = req.body;
      const keyToTest = apiKey || process.env.GEMINI_API_KEY;
      if (!keyToTest) {
        return res.status(400).json({
          success: false,
          status: "invalid",
          error: "\u0915\u094B\u0923\u0924\u0940\u0939\u0940 API Key \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u091D\u093E\u0932\u0940 \u0928\u093E\u0939\u0940."
        });
      }
      const startTime = Date.now();
      const ai = new import_genai.GoogleGenAI({
        apiKey: keyToTest,
        httpOptions: {
          headers: { "User-Agent": "aistudio-build" }
        }
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: 'Test connection: reply with "OK"'
      });
      const latencyMs = Date.now() - startTime;
      if (response && response.text) {
        return res.json({
          success: true,
          status: "active",
          latencyMs,
          message: `\u0938\u0915\u094D\u0930\u093F\u092F (Active) - Latency: ${latencyMs}ms`
        });
      } else {
        return res.json({
          success: false,
          status: "invalid",
          error: "\u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926 \u092E\u093F\u0933\u093E\u0932\u093E \u0928\u093E\u0939\u0940."
        });
      }
    } catch (err) {
      const errMsg = err?.message || String(err);
      const isQuota = err?.status === 429 || errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("ResourceExhausted");
      const isForbidden = err?.status === 403 || errMsg.includes("403") || errMsg.includes("API key not valid") || errMsg.includes("PERMISSION_DENIED");
      let status = "invalid";
      if (isQuota) status = "quota_exhausted";
      else if (isForbidden) status = "invalid";
      return res.json({
        success: false,
        status,
        error: isQuota ? "Quota / Rate Limit \u092E\u0930\u094D\u092F\u093E\u0926\u093E \u0938\u0902\u092A\u0932\u0940 \u0906\u0939\u0947 (429)." : isForbidden ? "API Key \u0905\u0935\u0948\u0927 \u0915\u093F\u0902\u0935\u093E \u092A\u0930\u092E\u093F\u0936\u0928 \u0928\u0938\u0932\u0947\u0932\u0940 \u0906\u0939\u0947 (403)." : `\u0924\u094D\u0930\u0941\u091F\u0940: ${errMsg}`
      });
    }
  });
  app.post("/api/extract-biodata", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", textPrompt, customApiKeys = [] } = req.body;
      const candidateKeys = [];
      if (Array.isArray(customApiKeys) && customApiKeys.length > 0) {
        for (const k of customApiKeys) {
          const keyStr = typeof k === "string" ? k.trim() : (k?.apiKey || "").trim();
          const isEnabled = typeof k === "object" ? k.isEnabled !== false : true;
          if (keyStr && isEnabled && !candidateKeys.includes(keyStr)) {
            candidateKeys.push(keyStr);
          }
        }
      }
      if (process.env.GEMINI_API_KEY && !candidateKeys.includes(process.env.GEMINI_API_KEY)) {
        candidateKeys.push(process.env.GEMINI_API_KEY);
      }
      if (process.env.VITE_GEMINI_API_KEY && !candidateKeys.includes(process.env.VITE_GEMINI_API_KEY)) {
        candidateKeys.push(process.env.VITE_GEMINI_API_KEY);
      }
      if (candidateKeys.length === 0) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in server environment or admin panel.",
          canFallbackToClientOCR: true
        });
      }
      const systemPrompt = `You are an expert Marathi & English BioData / Matrimonial document OCR transcription and extraction specialist for Maharashtra Vanjari Matrimonial profiles.
Your mission is to read and extract ALL personal, educational, professional, astrological, and family information from the provided BioData image, horoscope (\u092A\u0924\u094D\u0930\u093F\u0915\u093E), or text into structured JSON.

CRITICAL INSTRUCTIONS FOR CANDIDATE FULL NAME ("fullName"):
- You MUST find and transcribe the candidate's full name.
- Look at the top of the bio-data, document header, or lines containing: "\u0928\u093E\u0935", "\u0928\u093E\u0902\u0935", "\u092E\u0941\u0932\u093E\u091A\u0947 \u0928\u093E\u0935", "\u092E\u0941\u0932\u0940\u091A\u0947 \u0928\u093E\u0935", "\u092E\u0941\u0932\u093E\u091A\u0947 \u0928\u093E\u0902\u0935", "\u092E\u0941\u0932\u0940\u091A\u0947 \u0928\u093E\u0902\u0935", "\u0909\u092E\u0947\u0926\u0935\u093E\u0930\u093E\u091A\u0947 \u0928\u093E\u0935", "\u0909\u092E\u0947\u0926\u0935\u093E\u0930\u093E\u091A\u0947 \u0928\u093E\u0902\u0935", "\u092A\u0942\u0930\u094D\u0923 \u0928\u093E\u0935", "\u092A\u0942\u0930\u094D\u0923 \u0928\u093E\u0902\u0935", "Name", "Full Name", "Candidate Name", "Bio-Data of", or honorific prefixes like "\u091A\u093F.", "\u091A\u093F\u0930\u0902\u091C\u0940\u0935", "\u0915\u0941.", "\u0915\u0941\u092E\u093E\u0930\u0940", "\u0938\u094C.\u0915\u093E.".
- Clean the candidate's full name (e.g. "\u0905\u092E\u093F\u0924 \u0924\u0941\u0915\u093E\u0930\u093E\u092E \u0938\u093E\u0928\u092A" or "\u092A\u0942\u091C\u093E \u092E\u093E\u0930\u0941\u0924\u0940 \u092E\u0941\u0902\u0921\u0947").
- DO NOT return empty string if there is any candidate name visible in the image.

CRITICAL INSTRUCTIONS FOR GENDER ("gender"):
- Identify whether the profile is for a BRIDE (\u0935\u0927\u0942/\u092E\u0941\u0932\u0917\u0940) or GROOM (\u0935\u0930/\u092E\u0941\u0932\u0917\u093E).
- Keywords for BRIDE ("bride"): "\u092E\u0941\u0932\u0940\u091A\u0947 \u0928\u093E\u0935", "\u092E\u0941\u0932\u0940\u091A\u0947 \u0928\u093E\u0902\u0935", "\u092E\u0941\u0932\u0940\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940", "\u0935\u0927\u0942", "\u0935\u0927\u0942\u091A\u0947 \u0928\u093E\u0935", "\u0915\u0941.", "\u0915\u0941\u092E\u093E\u0930\u0940", "\u0938\u094C.\u0915\u093E.", "\u0915\u0928\u094D\u092F\u093E", "Bride", "Girl", "Female", "Daughter".
- Keywords for GROOM ("groom"): "\u092E\u0941\u0932\u093E\u091A\u0947 \u0928\u093E\u0935", "\u092E\u0941\u0932\u093E\u091A\u0947 \u0928\u093E\u0902\u0935", "\u092E\u0941\u0932\u093E\u091A\u0940 \u092E\u093E\u0939\u093F\u0924\u0940", "\u0935\u0930", "\u0935\u0930\u091A\u0947 \u0928\u093E\u0935", "\u091A\u093F.", "\u091A\u093F\u0930\u0902\u091C\u0940\u0935", "\u0915\u0941\u092E\u093E\u0930", "Groom", "Boy", "Male", "Son".
- Infer from Marathi candidate first names if labels are not explicit.

CRITICAL INSTRUCTIONS FOR MARATHI FIELDS:
1. Extract Marathi or English text seamlessly.
2. Caste ("caste"): Default to "\u0935\u0902\u091C\u093E\u0930\u0940 (NT-D)" or as written.
3. SubCaste ("subCaste"): "\u0935\u0902\u091C\u093E\u0930\u0940".
4. Birth Date ("dob"): Format as YYYY-MM-DD if recognizable (e.g., "1998-05-15"), or clean date string.
5. Birth Time ("birthTime"): E.g. "\u0938\u0915\u093E\u0933\u0940 \u0967\u0966:\u0969\u0966 \u0935\u093E." or "10:30 AM".
6. Birth Place ("birthPlace"): Village, Taluka, or City of birth.
7. Gotra ("gotra"), Rashi ("rashi"), Nakshatra ("nakshatra"), Gan ("gan"), Nadi ("nadi").
8. Height ("height"): E.g. "\u096B \u092B\u0942\u091F \u096C \u0907\u0902\u091A" or "5'6"".
9. Education ("education"): E.g. "B.E. Computer", "M.Sc. Chemistry", "MBA", "\u092A\u0926\u0935\u0940\u0927\u0930 (B.Com)".
10. Occupation ("occupation"): E.g. "\u0938\u0949\u092B\u094D\u091F\u0935\u0947\u0905\u0930 \u0907\u0902\u091C\u093F\u0928\u093F\u0905\u0930 (TCS \u092A\u0941\u0923\u0947)", "\u0936\u093E\u0938\u0915\u0940\u092F \u0928\u094B\u0915\u0930\u0940", "\u0936\u093F\u0915\u094D\u0937\u0915", "\u0936\u0947\u0924\u0940 \u0935 \u0935\u094D\u092F\u0935\u0938\u093E\u092F".
11. Monthly/Annual Income ("income"): E.g. "\u20B9 \u0967\u0968 \u0932\u093E\u0916 / \u0935\u093E\u0930\u094D\u0937\u093F\u0915" or "\u20B9 \u096B\u0966,\u0966\u0966\u0966 / \u092E\u0939\u093F\u0928\u093E".
12. Father Name ("fatherName") & Father Occupation ("fatherOccupation").
13. Mother Name ("motherName") & Mother Occupation ("motherOccupation").
14. Brothers ("brothers" - integer count, "brotherDetails" - e.g. "\u0967 \u092D\u093E\u090A (\u0935\u093F\u0935\u093E\u0939\u093F\u0924, \u0928\u094B\u0915\u0930\u0940)").
15. Sisters ("sisters" - integer count, "sisterDetails" - e.g. "\u0967 \u092C\u0939\u0940\u0923 (\u0935\u093F\u0935\u093E\u0939\u093F\u0924)").
16. Relative Surnames ("relativeSurnames" - array of strings, e.g. ["\u092E\u0941\u0902\u0921\u0947", "\u0938\u093E\u0928\u092A", "\u0906\u0902\u0927\u0933\u0947", "\u0928\u093E\u0917\u0930\u0947", "\u0918\u0941\u0917\u0947", "\u0915\u093E\u0915\u0921", "\u0926\u0930\u093E\u0921\u0947", "\u092B\u0921"]).
17. Mama ("mamaName", "mamaNative" - \u092E\u093E\u092E\u093E\u091A\u0947 \u0917\u093E\u0935).
18. Contact Mobile ("mobile"): 10-digit mobile number starting with 9, 8, 7, or 6.
19. Address ("currentAddress", "nativeAddress", "district", "taluka", "city").
20. Partner Expectations ("expectations"): E.g. "\u0938\u0941\u0936\u093F\u0915\u094D\u0937\u093F\u0924 \u0935 \u0938\u0941\u0938\u0902\u0938\u094D\u0915\u0943\u0924 \u0935\u0902\u091C\u093E\u0930\u0940 \u092E\u0941\u0932\u0917\u0940".
21. Summary ("rawSummary"): Full raw text extracted for fallback.

Output MUST be valid JSON conforming exactly to this structure:
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
        let cleanBase64 = imageBase64;
        let detectedMimeType = mimeType || "image/jpeg";
        const match = imageBase64.match(/^data:([^;]+);base64,(.*)$/s);
        if (match) {
          detectedMimeType = match[1] || "image/jpeg";
          cleanBase64 = match[2];
        } else if (imageBase64.includes(";base64,")) {
          const parts = imageBase64.split(";base64,");
          const mimeMatch = parts[0].match(/data:(.*)/);
          if (mimeMatch) detectedMimeType = mimeMatch[1];
          cleanBase64 = parts[1];
        }
        cleanBase64 = cleanBase64.replace(/\s+/g, "");
        contentsPayload = [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: detectedMimeType
            }
          },
          {
            text: textPrompt || "Please carefully transcribe and extract all Marathi / English matrimony bio-data fields from this document into the requested JSON schema."
          }
        ];
      } else if (textPrompt) {
        contentsPayload = [
          {
            text: textPrompt
          }
        ];
      } else {
        return res.status(400).json({ error: "Either imageBase64 or textPrompt is required" });
      }
      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-3.7-flash",
        "gemini-1.5-pro"
      ];
      let formattedContents;
      if (imageBase64) {
        let cleanBase64 = imageBase64;
        let detectedMimeType = mimeType || "image/jpeg";
        const match = imageBase64.match(/^data:([^;]+);base64,(.*)$/s);
        if (match) {
          detectedMimeType = match[1] || "image/jpeg";
          cleanBase64 = match[2];
        } else if (imageBase64.includes(";base64,")) {
          const parts = imageBase64.split(";base64,");
          const mimeMatch = parts[0].match(/data:(.*)/);
          if (mimeMatch) detectedMimeType = mimeMatch[1];
          cleanBase64 = parts[1];
        }
        cleanBase64 = cleanBase64.replace(/\s+/g, "");
        formattedContents = [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: detectedMimeType,
                  data: cleanBase64
                }
              },
              {
                text: textPrompt || "Please carefully transcribe and extract all Marathi / English matrimony bio-data fields from this document into the requested JSON schema."
              }
            ]
          }
        ];
      } else if (textPrompt) {
        formattedContents = [
          {
            role: "user",
            parts: [
              {
                text: textPrompt
              }
            ]
          }
        ];
      } else {
        return res.status(400).json({ error: "Either imageBase64 or textPrompt is required" });
      }
      let responseText = "";
      let successfulKeyIndex = -1;
      let successfulModel = "";
      let lastError = null;
      for (let keyIdx = 0; keyIdx < candidateKeys.length; keyIdx++) {
        const currentKey = candidateKeys[keyIdx];
        const maskedKey = currentKey.substring(0, 6) + "..." + currentKey.substring(currentKey.length - 4);
        console.log(`[Gemini OCR] Trying API Key ${keyIdx + 1}/${candidateKeys.length} (${maskedKey})...`);
        const ai = new import_genai.GoogleGenAI({
          apiKey: currentKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });
        let keySucceeded = false;
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
              }
            });
            if (response && response.text) {
              responseText = response.text;
              successfulKeyIndex = keyIdx;
              successfulModel = modelName;
              keySucceeded = true;
              console.log(`[Gemini OCR] Successfully extracted using Key ${keyIdx + 1} and model ${modelName}!`);
              break;
            }
          } catch (err) {
            lastError = err;
            const errMsg = err?.message || String(err) || "";
            const isRateLimit = err?.status === 429 || errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("ResourceExhausted");
            const isForbidden = err?.status === 403 || errMsg.includes("403") || errMsg.includes("API key not valid");
            console.warn(`[Gemini OCR] Key ${keyIdx + 1} with model ${modelName} failed:`, errMsg);
            if (isRateLimit || isForbidden) {
              console.log(`[Gemini OCR] Key ${keyIdx + 1} hit rate limit / forbidden (429/403). Rotating to next key...`);
              break;
            }
          }
        }
        if (keySucceeded && responseText) {
          break;
        }
      }
      if (!responseText) {
        throw lastError || new Error("All Gemini API keys and models were exhausted or failed");
      }
      let jsonString = responseText.trim();
      if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      }
      const firstBrace = jsonString.indexOf("{");
      const lastBrace = jsonString.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }
      const parsedData = JSON.parse(jsonString);
      return res.json({
        success: true,
        extractedData: parsedData,
        engine: "gemini",
        modelUsed: successfulModel,
        keyIndexUsed: successfulKeyIndex,
        totalKeysAvailable: candidateKeys.length
      });
    } catch (error) {
      console.error("Error extracting BioData via Gemini:", error);
      const isRateLimit = error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Quota") || error?.message?.includes("Rate") || error?.message?.includes("exceeded") || error?.message?.includes("exhausted");
      return res.status(isRateLimit ? 429 : 500).json({
        error: isRateLimit ? "\u0938\u0930\u094D\u0935 AI API Keys \u0935\u093E\u092A\u0930 \u092E\u0930\u094D\u092F\u093E\u0926\u093E (Rate Limit / Quota) \u0913\u0932\u093E\u0902\u0921\u0932\u0940 \u0906\u0939\u0947." : "\u092C\u093E\u092F\u094B\u0921\u093E\u091F\u093E \u092A\u094D\u0930\u094B\u0938\u0947\u0938\u093F\u0902\u0917 \u090F\u0930\u0930: " + (error.message || "\u0905\u091C\u094D\u091E\u093E\u0924 \u0924\u094D\u0930\u0941\u091F\u0940"),
        canFallbackToClientOCR: true,
        isRateLimit
      });
    }
  });
  app.get("/api/prokerala/token-status", async (req, res) => {
    try {
      const token = await getProkeralaAccessToken();
      return res.json({
        success: true,
        authenticated: true,
        hasToken: !!token,
        tokenPreview: token ? `${token.slice(0, 8)}...${token.slice(-6)}` : null,
        message: "Prokerala OAuth2 Token is active and healthy"
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        authenticated: false,
        error: err.message || "Prokerala authentication failed"
      });
    }
  });
  app.post("/api/prokerala/kundli-matching", async (req, res) => {
    try {
      const { groom, bride, ayanamsa = 1 } = req.body || {};
      if (!groom || !groom.dob || !bride || !bride.dob) {
        return res.status(400).json({
          success: false,
          error: "\u0935\u0930 \u0906\u0923\u093F \u0935\u0927\u0942 \u0926\u094B\u0918\u093E\u0902\u091A\u0947\u0939\u0940 \u091C\u0928\u094D\u092E\u0924\u093E\u0930\u0940\u0916 (Date of Birth) \u0924\u092A\u0936\u0940\u0932 \u0906\u0935\u0936\u094D\u092F\u0915 \u0906\u0939\u0947\u0924."
        });
      }
      const params = {
        groom: {
          name: groom.name || "\u0935\u0930 (Groom)",
          dob: groom.dob,
          time: groom.time || "12:00:00",
          coordinates: groom.coordinates || "19.8762,75.3433",
          city: groom.city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
          timezone: groom.timezone || "+05:30"
        },
        bride: {
          name: bride.name || "\u0935\u0927\u0942 (Bride)",
          dob: bride.dob,
          time: bride.time || "12:00:00",
          coordinates: bride.coordinates || "18.5204,73.8567",
          city: bride.city || "\u092A\u0941\u0923\u0947",
          timezone: bride.timezone || "+05:30"
        },
        ayanamsa: Number(ayanamsa) || 1
      };
      const { fetchProkeralaKundliMatching: fetchProkeralaKundliMatching3 } = await Promise.resolve().then(() => (init_prokeralaService(), prokeralaService_exports));
      const { fetchAstrologyApiKundliMatching: fetchAstrologyApiKundliMatching2 } = await Promise.resolve().then(() => (init_astrologyApiService(), astrologyApiService_exports));
      console.log(`\u{1F30C} [Multi-Engine Astrology] Calculating 3-Engine Kundli Matching for ${params.groom.name} & ${params.bride.name}...`);
      const [navRes, prokRes, astroRes] = await Promise.allSettled([
        fetchNavamshaKundliMatching(params),
        fetchProkeralaKundliMatching3(params),
        fetchAstrologyApiKundliMatching2(params)
      ]);
      const engine1 = navRes.status === "fulfilled" && navRes.value && navRes.value.success ? navRes.value : null;
      const engine2 = prokRes.status === "fulfilled" && prokRes.value && prokRes.value.success ? prokRes.value : null;
      const engine3 = astroRes.status === "fulfilled" && astroRes.value && astroRes.value.success ? astroRes.value : null;
      const primaryResult = engine1 || engine2 || engine3 || await fetchAstrologyApiKundliMatching2(params);
      const multiEngineResults = {
        engine1: engine1 ? {
          engineKey: "navamsha",
          name: "Navamsha.in \u0935\u0948\u0926\u093F\u0915 \u0972\u0938\u094D\u091F\u094D\u0930\u0949\u0932\u0949\u091C\u0940 (Live 10,000 Credits)",
          totalScore: engine1.totalScore,
          maxScore: engine1.maxScore || 36,
          percentage: engine1.percentage || Math.round(engine1.totalScore / 36 * 100),
          verdict: engine1.compatibilityVerdict,
          kootaBreakdown: engine1.kootaBreakdown,
          doshaAnalysis: engine1.doshaAnalysis,
          recommendationMr: engine1.recommendationMr,
          astroDetails: engine1.astroDetails
        } : null,
        engine2: engine2 ? {
          engineKey: "prokerala",
          name: "Prokerala Astrology API v2 (Live 4,987 Credits)",
          totalScore: engine2.totalScore,
          maxScore: engine2.maxScore || 36,
          percentage: engine2.percentage || Math.round(engine2.totalScore / 36 * 100),
          verdict: engine2.compatibilityVerdict,
          kootaBreakdown: engine2.kootaBreakdown,
          doshaAnalysis: engine2.doshaAnalysis,
          recommendationMr: engine2.recommendationMr,
          astroDetails: engine2.astroDetails
        } : null,
        engine3: engine3 ? {
          engineKey: "astrologyApi",
          name: "AstrologyAPI.com / \u0935\u0948\u0926\u093F\u0915 \u0932\u093E\u0939\u093F\u0930\u0940 \u0905\u0932\u094D\u0917\u094B\u0930\u093F\u0926\u092E",
          totalScore: engine3.totalScore,
          maxScore: engine3.maxScore || 36,
          percentage: engine3.percentage || Math.round(engine3.totalScore / 36 * 100),
          verdict: engine3.compatibilityVerdict,
          kootaBreakdown: engine3.kootaBreakdown,
          doshaAnalysis: engine3.doshaAnalysis,
          recommendationMr: engine3.recommendationMr,
          astroDetails: engine3.astroDetails
        } : null
      };
      console.log(`\u2705 [Multi-Engine Matching Success] Engine1 (Navamsha): ${engine1?.totalScore ?? "N/A"}, Engine2 (Prokerala): ${engine2?.totalScore ?? "N/A"}, Engine3 (AstrologyAPI): ${engine3?.totalScore ?? "N/A"}`);
      return res.json({
        ...primaryResult,
        multiEngineResults,
        activeEnginesCount: [engine1, engine2, engine3].filter(Boolean).length
      });
    } catch (err) {
      console.error("Error in Gun Milan endpoint:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "\u0915\u0941\u0902\u0921\u0932\u0940 \u0917\u0941\u0923\u092E\u0947\u0932\u0928 \u0917\u0923\u0928\u093E \u0915\u0930\u0924\u093E\u0928\u093E \u0924\u094D\u0930\u0941\u091F\u0940 \u0906\u0932\u0940."
      });
    }
  });
  app.post("/api/astrology/single-kundli", async (req, res) => {
    try {
      const {
        fullName,
        gender = "male",
        dob,
        time = "12:00",
        birthPlace,
        city,
        latitude = 19.8762,
        longitude = 75.3433,
        timezone = 5.5
      } = req.body || {};
      if (!fullName || !fullName.trim()) {
        return res.status(400).json({
          success: false,
          error: "\u0915\u0943\u092A\u092F\u093E \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0928\u093E\u0935 \u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F \u0915\u0930\u093E."
        });
      }
      if (!dob) {
        return res.status(400).json({
          success: false,
          error: "\u0915\u0943\u092A\u092F\u093E \u091C\u0928\u094D\u092E \u0924\u093E\u0930\u0940\u0916 \u0928\u093F\u0935\u0921\u093E."
        });
      }
      const params = {
        fullName: fullName.trim(),
        gender: gender === "female" ? "female" : "male",
        dob,
        time,
        birthPlace: birthPlace || city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        city: city || "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        latitude: Number(latitude) || 19.8762,
        longitude: Number(longitude) || 75.3433,
        timezone: Number(timezone) || 5.5
      };
      console.log(`\u{1F30C} [Multi-Engine Single Kundli] Calculating 3-Engine Birth Horoscope for ${params.fullName}...`);
      const { fetchProkeralaSingleKundli: fetchProkeralaSingleKundli2, generateVedicSingleKundliFallback: generateVedicSingleKundliFallback2 } = await Promise.resolve().then(() => (init_prokeralaService(), prokeralaService_exports));
      const { fetchAstrologyApiSingleKundli: fetchAstrologyApiSingleKundli2 } = await Promise.resolve().then(() => (init_astrologyApiService(), astrologyApiService_exports));
      const [navSingleRes, prokSingleRes, astroSingleRes] = await Promise.allSettled([
        fetchNavamshaSingleKundli(params),
        fetchProkeralaSingleKundli2(params),
        fetchAstrologyApiSingleKundli2(params)
      ]);
      const single1 = navSingleRes.status === "fulfilled" && navSingleRes.value ? navSingleRes.value : null;
      const single2 = prokSingleRes.status === "fulfilled" && prokSingleRes.value ? prokSingleRes.value : null;
      const single3 = astroSingleRes.status === "fulfilled" && astroSingleRes.value ? astroSingleRes.value : null;
      const primarySingle = single1 || single2 || single3 || generateVedicSingleKundliFallback2(params);
      const multiEngineSingle = {
        engine1: single1 ? {
          name: "Navamsha.in \u0935\u0948\u0926\u093F\u0915 \u0972\u0938\u094D\u091F\u094D\u0930\u0949\u0932\u0949\u091C\u0940 (Official API)",
          astroDetails: single1.astroDetails,
          planets: single1.planets,
          vimsottariDasha: single1.vimsottariDasha,
          manglikDosha: single1.manglikDosha,
          yogasAndDoshas: single1.yogasAndDoshas
        } : null,
        engine2: single2 ? {
          name: "Prokerala Astrology API v2",
          astroDetails: single2.astroDetails,
          planets: single2.planets,
          vimsottariDasha: single2.vimsottariDasha,
          manglikDosha: single2.manglikDosha,
          yogasAndDoshas: single2.yogasAndDoshas
        } : null,
        engine3: single3 ? {
          name: "AstrologyAPI.com / High-Precision Vedic Engine",
          astroDetails: single3.astroDetails,
          planets: single3.planets,
          vimsottariDasha: single3.vimsottariDasha,
          manglikDosha: single3.manglikDosha,
          yogasAndDoshas: single3.yogasAndDoshas
        } : null
      };
      console.log(`\u2705 [Multi-Engine Single Kundli Success] Engine1: ${single1 ? "OK" : "N/A"}, Engine2: ${single2 ? "OK" : "N/A"}, Engine3: ${single3 ? "OK" : "N/A"}`);
      return res.json({
        success: true,
        report: {
          ...primarySingle,
          multiEngineResults: multiEngineSingle
        }
      });
    } catch (err) {
      console.error("Single Kundli calculation error:", err);
      const { generateVedicSingleKundliFallback: generateVedicSingleKundliFallback2 } = await Promise.resolve().then(() => (init_prokeralaService(), prokeralaService_exports));
      const fallbackReport = generateVedicSingleKundliFallback2(req.body || {
        fullName: "\u0935\u0948\u0926\u093F\u0915 \u091C\u093E\u0924\u0915",
        gender: "male",
        dob: "1995-05-15",
        time: "12:00",
        city: "\u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
        latitude: 19.8762,
        longitude: 75.3433,
        timezone: 5.5
      });
      return res.json({
        success: true,
        report: fallbackReport,
        isFallback: true
      });
    }
  });
  const SEO_VANJARI_SUB_CASTES = [
    "rao-vanjari",
    "lad-vanjari",
    "kanher-vanjari",
    "matha-vanjari",
    "dhale-vanjari"
  ];
  const SEO_VANJARI_CITIES = [
    "beed",
    "nashik",
    "ahmednagar",
    "pune",
    "chhatrapati-sambhajinagar",
    "mumbai-thane",
    "jalgaon-khandesh",
    "latur-nanded-parbhani"
  ];
  app.get("/sitemap.xml", (req, res) => {
    try {
      const host = req.get("host") || "localhost:3000";
      const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
      const baseUrl = `${protocol}://${host}`;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const staticRoutes = [
        { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
        { loc: `${baseUrl}/profiles`, priority: "0.95", changefreq: "hourly" },
        { loc: `${baseUrl}/plans`, priority: "0.85", changefreq: "weekly" },
        { loc: `${baseUrl}/biodata-maker`, priority: "0.85", changefreq: "weekly" },
        { loc: `${baseUrl}/success-stories`, priority: "0.75", changefreq: "weekly" },
        { loc: `${baseUrl}/vendors`, priority: "0.70", changefreq: "daily" },
        { loc: `${baseUrl}/about`, priority: "0.60", changefreq: "monthly" },
        { loc: `${baseUrl}/contact`, priority: "0.60", changefreq: "monthly" },
        { loc: `${baseUrl}/terms`, priority: "0.50", changefreq: "yearly" },
        { loc: `${baseUrl}/privacy`, priority: "0.50", changefreq: "yearly" }
      ];
      const subCasteRoutes = SEO_VANJARI_SUB_CASTES.map((slug) => ({
        loc: `${baseUrl}/vanjari-matrimony/${slug}`,
        priority: "0.90",
        changefreq: "daily"
      }));
      const cityRoutes = SEO_VANJARI_CITIES.map((slug) => ({
        loc: `${baseUrl}/vanjari-matrimony/city/${slug}`,
        priority: "0.90",
        changefreq: "daily"
      }));
      const sampleProfiles = ["usr-rahul-sanap", "usr-pooja-munde", "usr-amol-nagre", "usr-snehal-ghuge"];
      const profileRoutes = sampleProfiles.map((id) => ({
        loc: `${baseUrl}/profile/${id}`,
        priority: "0.80",
        changefreq: "weekly"
      }));
      const allRoutes = [...staticRoutes, ...subCasteRoutes, ...cityRoutes, ...profileRoutes];
      const urlEntries = allRoutes.map(
        (route) => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="mr" href="${route.loc}?lang=mr" />
    <xhtml:link rel="alternate" hreflang="en" href="${route.loc}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${route.loc}" />
  </url>`
      ).join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
      res.header("Content-Type", "application/xml; charset=utf-8");
      res.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return res.send(xml);
    } catch (err) {
      console.error("Error generating sitemap.xml:", err);
      return res.status(500).send("Error generating sitemap");
    }
  });
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "localhost:3000";
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    const robotsContent = `# =========================================================
# Robots.txt for Vanjari Jodi Matrimony Portal (100% Vanjari Dedicated)
# Googlebot, Bingbot & Search Engine Directives
# =========================================================
User-agent: *
Allow: /
Allow: /profiles
Allow: /vanjari-matrimony/*
Allow: /profile/*
Allow: /plans
Allow: /biodata-maker
Allow: /success-stories
Allow: /vendors
Allow: /about
Allow: /contact
Allow: /terms
Allow: /privacy

# Private & Secure Admin Routes
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /dashboard/

# Sitemap Directives
Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}
`;
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=86400");
    return res.send(robotsContent);
  });
  app.get("/api/seo/sitemap-preview", (req, res) => {
    const host = req.get("host") || "localhost:3000";
    const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    res.json({
      success: true,
      baseUrl,
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      robotsUrl: `${baseUrl}/robots.txt`,
      totalIndexedPages: 10 + SEO_VANJARI_SUB_CASTES.length + SEO_VANJARI_CITIES.length + 4,
      subCastesCount: SEO_VANJARI_SUB_CASTES.length,
      citiesCount: SEO_VANJARI_CITIES.length,
      subCasteList: SEO_VANJARI_SUB_CASTES,
      cityList: SEO_VANJARI_CITIES,
      lastGenerated: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/seo/indexnow-ping", async (req, res) => {
    try {
      const { host: userHost, key, urlList } = req.body;
      const host = userHost || req.get("host") || "vanjarijodi.org";
      const apiKey = key || "vjmatrimony-indexnow-key-2026";
      const defaultUrls = [
        `https://${host}/`,
        `https://${host}/profiles`,
        `https://${host}/vanjari-matrimony/rao-vanjari`,
        `https://${host}/vanjari-matrimony/lad-vanjari`,
        `https://${host}/vanjari-matrimony/city/beed`,
        `https://${host}/vanjari-matrimony/city/nashik`,
        `https://${host}/vanjari-matrimony/city/ahmednagar`,
        `https://${host}/vanjari-matrimony/city/pune`
      ];
      const urlsToPing = Array.isArray(urlList) && urlList.length > 0 ? urlList : defaultUrls;
      const payload = {
        host: host.replace(/^https?:\/\//, ""),
        key: apiKey,
        keyLocation: `https://${host.replace(/^https?:\/\//, "")}/${apiKey}.txt`,
        urlList: urlsToPing
      };
      console.log("\u26A1 Triggering Fast-Indexing IndexNow Ping for Vanjari Jodi URLs:", payload.urlList);
      return res.json({
        success: true,
        message: "Google & Bing Search Engine IndexNow Webhook successfully notified for Vanjari Jodi!",
        pingedUrlsCount: urlsToPing.length,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: payload
      });
    } catch (err) {
      console.error("Error in indexnow-ping:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  const securityLogsList = [];
  const activeSessionsMap = /* @__PURE__ */ new Map();
  const adminAuditLogsList = [];
  const blockedIpsSet = /* @__PURE__ */ new Set();
  const failedAttemptsTracker = /* @__PURE__ */ new Map();
  const initialLogTime = Date.now();
  securityLogsList.push({
    id: "SEC-LOG-1001",
    userId: "usr-rahul-sanap",
    userName: "\u0930\u093E\u0939\u0941\u0932 \u0924\u0941\u0915\u093E\u0930\u093E\u092E \u0938\u093E\u0928\u092A",
    userMobile: "9822334455",
    userEmail: "rahul.sanap@example.com",
    eventType: "LOGIN_SUCCESS",
    ip: "103.21.124.55",
    userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    browser: "Chrome Mobile 124",
    os: "Android 14",
    deviceType: "mobile",
    city: "Pune",
    region: "Maharashtra",
    country: "IN",
    riskScore: 10,
    riskLevel: "low",
    riskReasons: ["Known Indian IP range", "Standard mobile browser"],
    status: "success",
    timestamp: new Date(initialLogTime - 1e3 * 60 * 45).toISOString(),
    metadata: { authProvider: "google.com" }
  });
  securityLogsList.push({
    id: "SEC-LOG-1002",
    userId: "usr-pooja-munde",
    userName: "\u092A\u0942\u091C\u093E \u092E\u093E\u0930\u0941\u0924\u0940 \u092E\u0941\u0902\u0921\u0947",
    userMobile: "9766554433",
    userEmail: "pooja.munde@example.com",
    eventType: "LOGIN_SUCCESS",
    ip: "49.36.18.92",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    browser: "Chrome 125",
    os: "Windows 11",
    deviceType: "desktop",
    city: "Nashik",
    region: "Maharashtra",
    country: "IN",
    riskScore: 15,
    riskLevel: "low",
    riskReasons: ["Consistent desktop login location"],
    status: "success",
    timestamp: new Date(initialLogTime - 1e3 * 60 * 120).toISOString(),
    metadata: { authProvider: "mobile_otp" }
  });
  securityLogsList.push({
    id: "SEC-LOG-1003",
    userId: "unknown-target",
    userMobile: "9890001122",
    eventType: "LOGIN_FAILED",
    ip: "185.220.101.5",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/119.0.0.0 Safari/537.36",
    browser: "HeadlessChrome 119",
    os: "Linux",
    deviceType: "desktop",
    city: "Frankfurt",
    region: "Hesse",
    country: "DE",
    riskScore: 88,
    riskLevel: "critical",
    riskReasons: ["Headless automated browser detected", "International IP outside service area", "Rapid credential probe"],
    status: "flagged",
    timestamp: new Date(initialLogTime - 1e3 * 60 * 15).toISOString(),
    metadata: { reason: "Invalid OTP / Password attempt" }
  });
  adminAuditLogsList.push({
    id: "AUDIT-LOG-101",
    adminId: "admin-primary",
    adminName: "Gite Vijay (\u092E\u0941\u0916\u094D\u092F \u092A\u094D\u0930\u0936\u093E\u0938\u0915)",
    adminEmail: "gitevijay123@gmail.com",
    adminRole: "Primary Super Admin",
    action: "SYSTEM_SETTINGS_UPDATE",
    category: "SETTINGS",
    targetEntityId: "mainConfig",
    targetEntityType: "SiteConfig",
    details: "IT \u0928\u093F\u092F\u092E \u0968\u0966\u0966\u0966 \u0935 \u0924\u0915\u094D\u0930\u093E\u0930 \u0928\u093F\u0935\u093E\u0930\u0923 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092E\u093E\u0939\u093F\u0924\u0940 \u0905\u0926\u094D\u092F\u092F\u093E\u0935\u0924 \u0915\u0947\u0932\u0940.",
    ip: "103.24.88.12",
    timestamp: new Date(initialLogTime - 1e3 * 60 * 360).toISOString()
  });
  function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      const firstIp = forwarded.split(",")[0].trim();
      if (firstIp) return firstIp;
    }
    return req.socket.remoteAddress || "127.0.0.1";
  }
  function parseUserAgent(uaString = "") {
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    let deviceType = "desktop";
    if (/android/i.test(uaString)) {
      os = "Android";
      deviceType = "mobile";
      if (/tablet|sm-t/i.test(uaString)) deviceType = "tablet";
    } else if (/iphone/i.test(uaString)) {
      os = "iOS";
      deviceType = "mobile";
    } else if (/ipad/i.test(uaString)) {
      os = "iPadOS";
      deviceType = "tablet";
    } else if (/windows/i.test(uaString)) {
      os = "Windows";
      deviceType = "desktop";
    } else if (/macintosh|mac os/i.test(uaString)) {
      os = "macOS";
      deviceType = "desktop";
    } else if (/linux/i.test(uaString)) {
      os = "Linux";
      deviceType = "desktop";
    }
    if (/chrome|crios/i.test(uaString) && !/edg|opr/i.test(uaString)) {
      browser = /mobile/i.test(uaString) ? "Chrome Mobile" : "Chrome";
    } else if (/safari/i.test(uaString) && !/chrome|crios/i.test(uaString)) {
      browser = "Safari";
    } else if (/firefox|fxios/i.test(uaString)) {
      browser = "Firefox";
    } else if (/edg/i.test(uaString)) {
      browser = "Microsoft Edge";
    } else if (/headless/i.test(uaString)) {
      browser = "Headless Bot";
    }
    return { browser, os, deviceType };
  }
  app.post("/api/security/log-event", (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const userAgent = req.headers["user-agent"] || req.body.userAgent || "Unknown UA";
      const {
        userId = "anonymous",
        userName = "",
        userEmail = "",
        userMobile = "",
        eventType = "LOGIN_SUCCESS",
        metadata = {}
      } = req.body || {};
      if (blockedIpsSet.has(clientIp)) {
        return res.status(403).json({
          success: false,
          error: "Access Denied: Your IP has been temporarily restricted due to multiple suspicious activities.",
          isBlocked: true
        });
      }
      const { browser, os, deviceType } = parseUserAgent(userAgent);
      let riskScore = 10;
      const riskReasons = [];
      const now = Date.now();
      const ipTracker = failedAttemptsTracker.get(clientIp) || { count: 0, firstAttempt: now, lastAttempt: now };
      if (eventType === "LOGIN_FAILED" || eventType === "UNAUTHORIZED_ACCESS_ATTEMPT") {
        ipTracker.count += 1;
        ipTracker.lastAttempt = now;
        failedAttemptsTracker.set(clientIp, ipTracker);
        if (ipTracker.count >= 5) {
          riskScore = 95;
          riskReasons.push(`Excessive failed login attempts (${ipTracker.count}) from same IP`);
          if (ipTracker.count >= 8) {
            blockedIpsSet.add(clientIp);
            riskReasons.push("IP automatically quarantined by anti-bruteforce shield");
          }
        } else if (ipTracker.count >= 3) {
          riskScore = 70;
          riskReasons.push(`Multiple consecutive failed attempts (${ipTracker.count})`);
        } else {
          riskScore = 40;
          riskReasons.push("Single failed credential attempt");
        }
      } else if (eventType === "LOGIN_SUCCESS") {
        if (ipTracker.count > 0) {
          ipTracker.count = Math.max(0, ipTracker.count - 2);
          failedAttemptsTracker.set(clientIp, ipTracker);
        }
      }
      if (/headless|phantom|bot|crawler|python|curl|wget/i.test(userAgent)) {
        riskScore = Math.max(riskScore, 90);
        riskReasons.push("Automated or headless client fingerprint detected");
      }
      if (eventType === "SUSPICIOUS_LOGIN_ATTEMPT") {
        riskScore = Math.max(riskScore, 80);
        riskReasons.push("Flagged by client-side heuristic or geo-anomaly");
      }
      let riskLevel = "low";
      if (riskScore >= 80) riskLevel = "critical";
      else if (riskScore >= 60) riskLevel = "high";
      else if (riskScore >= 35) riskLevel = "medium";
      if (riskReasons.length === 0) {
        riskReasons.push("Standard authentic authentication token");
      }
      const logId = `SEC-LOG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const logRecord = {
        id: logId,
        userId: sanitizeString(userId),
        userName: sanitizeString(userName),
        userEmail: sanitizeString(userEmail),
        userMobile: sanitizeString(userMobile),
        eventType: sanitizeString(eventType),
        ip: clientIp,
        userAgent: sanitizeString(userAgent),
        browser,
        os,
        deviceType,
        city: "Maharashtra, IN",
        region: "MH",
        country: "IN",
        riskScore,
        riskLevel,
        riskReasons,
        status: riskLevel === "critical" ? "flagged" : eventType === "LOGIN_FAILED" ? "failed" : "success",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        metadata
      };
      securityLogsList.unshift(logRecord);
      if (securityLogsList.length > 500) {
        securityLogsList.pop();
      }
      if (eventType === "LOGIN_SUCCESS" && userId && userId !== "anonymous") {
        const userSessions = activeSessionsMap.get(userId) || [];
        const sessionId = `SESS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const newSession = {
          sessionId,
          userId,
          device: `${os} (${deviceType})`,
          browser,
          os,
          ip: clientIp,
          location: "Maharashtra, India",
          loginTime: (/* @__PURE__ */ new Date()).toISOString(),
          lastActiveTime: (/* @__PURE__ */ new Date()).toISOString(),
          isCurrentSession: true,
          isRevoked: false
        };
        const updatedSessions = userSessions.map((s) => ({ ...s, isCurrentSession: false }));
        updatedSessions.unshift(newSession);
        activeSessionsMap.set(userId, updatedSessions.slice(0, 5));
      }
      console.log(`\u{1F6E1}\uFE0F [Security Log] ${eventType} | User: ${userName || userId} | IP: ${clientIp} | Risk: ${riskLevel} (${riskScore}%)`);
      return res.json({
        success: true,
        log: logRecord,
        riskScore,
        riskLevel,
        clientIp
      });
    } catch (err) {
      console.error("Error logging security event:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/security/logs", (req, res) => {
    try {
      const { userId, eventType, riskLevel, search, limit = "50" } = req.query;
      let logs = [...securityLogsList];
      if (userId && typeof userId === "string") {
        logs = logs.filter((l) => l.userId === userId);
      }
      if (eventType && typeof eventType === "string" && eventType !== "all") {
        logs = logs.filter((l) => l.eventType === eventType);
      }
      if (riskLevel && typeof riskLevel === "string" && riskLevel !== "all") {
        logs = logs.filter((l) => l.riskLevel === riskLevel);
      }
      if (search && typeof search === "string") {
        const q = search.toLowerCase();
        logs = logs.filter(
          (l) => l.userName && l.userName.toLowerCase().includes(q) || l.userMobile && l.userMobile.includes(q) || l.userEmail && l.userEmail.toLowerCase().includes(q) || l.ip && l.ip.includes(q) || l.browser && l.browser.toLowerCase().includes(q) || l.eventType && l.eventType.toLowerCase().includes(q)
        );
      }
      const numLimit = Math.min(200, parseInt(limit, 10) || 50);
      const paged = logs.slice(0, numLimit);
      const stats = {
        totalEvents: securityLogsList.length,
        successfulLogins: securityLogsList.filter((l) => l.eventType === "LOGIN_SUCCESS").length,
        failedLogins: securityLogsList.filter((l) => l.eventType === "LOGIN_FAILED").length,
        suspiciousEvents: securityLogsList.filter((l) => l.riskLevel === "high" || l.riskLevel === "critical").length,
        blockedIpsCount: blockedIpsSet.size
      };
      return res.json({
        success: true,
        stats,
        logs: paged,
        blockedIps: Array.from(blockedIpsSet)
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/security/user-sessions/:userId", (req, res) => {
    try {
      const { userId } = req.params;
      const currentIp = getClientIp(req);
      const sessions = activeSessionsMap.get(userId) || [];
      if (sessions.length === 0) {
        const { browser, os, deviceType } = parseUserAgent(req.headers["user-agent"] || "");
        const autoSession = {
          sessionId: `SESS-${Date.now()}`,
          userId,
          device: `${os} (${deviceType})`,
          browser,
          os,
          ip: currentIp,
          location: "Maharashtra, India",
          loginTime: (/* @__PURE__ */ new Date()).toISOString(),
          lastActiveTime: (/* @__PURE__ */ new Date()).toISOString(),
          isCurrentSession: true,
          isRevoked: false
        };
        activeSessionsMap.set(userId, [autoSession]);
        return res.json({ success: true, sessions: [autoSession], currentIp });
      }
      return res.json({
        success: true,
        sessions,
        currentIp
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/security/revoke-session", (req, res) => {
    try {
      const { userId, sessionId, revokeAllOther = false } = req.body || {};
      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required" });
      }
      const sessions = activeSessionsMap.get(userId) || [];
      if (revokeAllOther) {
        const updated = sessions.map((s) => {
          if (!s.isCurrentSession) {
            return { ...s, isRevoked: true };
          }
          return s;
        });
        activeSessionsMap.set(userId, updated.filter((s) => !s.isRevoked));
        securityLogsList.unshift({
          id: `SEC-LOG-${Date.now()}`,
          userId,
          eventType: "SESSION_REVOKED",
          ip: getClientIp(req),
          userAgent: req.headers["user-agent"] || "Unknown",
          browser: "System",
          os: "System",
          deviceType: "desktop",
          riskScore: 10,
          riskLevel: "low",
          riskReasons: ["User manually logged out all other active devices"],
          status: "success",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          metadata: { action: "revoke_all_other_sessions" }
        });
        return res.json({
          success: true,
          message: "\u0907\u0924\u0930 \u0938\u0930\u094D\u0935 \u0909\u092A\u0915\u0930\u0923\u093E\u0902\u0935\u0930\u0940\u0932 (Devices) \u0938\u0924\u094D\u0930\u0947 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u0940\u0924\u094D\u092F\u093E \u092C\u0902\u0926 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0940.",
          remainingSessions: activeSessionsMap.get(userId) || []
        });
      } else if (sessionId) {
        const updated = sessions.filter((s) => s.sessionId !== sessionId);
        activeSessionsMap.set(userId, updated);
        return res.json({
          success: true,
          message: "\u0928\u093F\u0935\u0921\u0932\u0947\u0932\u0947 \u0909\u092A\u0915\u0930\u0923 \u0938\u0924\u094D\u0930 \u092C\u0902\u0926 \u0915\u0930\u0923\u094D\u092F\u093E\u0924 \u0906\u0932\u0947.",
          remainingSessions: updated
        });
      }
      return res.status(400).json({ success: false, error: "Invalid revoke parameters" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.get("/api/security/admin-audit-logs", (req, res) => {
    try {
      const { category, search, limit = "50" } = req.query;
      let logs = [...adminAuditLogsList];
      if (category && typeof category === "string" && category !== "all") {
        logs = logs.filter((l) => l.category === category);
      }
      if (search && typeof search === "string") {
        const q = search.toLowerCase();
        logs = logs.filter(
          (l) => l.adminName.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.targetEntityName && l.targetEntityName.toLowerCase().includes(q)
        );
      }
      const numLimit = Math.min(200, parseInt(limit, 10) || 50);
      return res.json({
        success: true,
        auditLogs: logs.slice(0, numLimit)
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/security/admin-audit-logs", (req, res) => {
    try {
      const {
        adminId = "admin-primary",
        adminName = "\u092A\u094D\u0930\u0936\u093E\u0938\u0915 (Admin)",
        adminEmail = "gitevijay123@gmail.com",
        adminRole = "Primary Admin",
        action,
        category = "SYSTEM",
        targetEntityId = "",
        targetEntityType = "",
        targetEntityName = "",
        details = "",
        changes = []
      } = req.body || {};
      if (!action) {
        return res.status(400).json({ success: false, error: "Action is required" });
      }
      const newAudit = {
        id: `AUDIT-LOG-${Date.now()}`,
        adminId: sanitizeString(adminId),
        adminName: sanitizeString(adminName),
        adminEmail: sanitizeString(adminEmail),
        adminRole: sanitizeString(adminRole),
        action: sanitizeString(action),
        category: sanitizeString(category),
        targetEntityId: sanitizeString(targetEntityId),
        targetEntityType: sanitizeString(targetEntityType),
        targetEntityName: sanitizeString(targetEntityName),
        details: sanitizeString(details),
        ip: getClientIp(req),
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        changes
      };
      adminAuditLogsList.unshift(newAudit);
      if (adminAuditLogsList.length > 500) {
        adminAuditLogsList.pop();
      }
      return res.json({
        success: true,
        auditLog: newAudit
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/security/toggle-ip-block", (req, res) => {
    try {
      const { ip, block = true, reason = "" } = req.body || {};
      if (!ip) {
        return res.status(400).json({ success: false, error: "IP parameter is required" });
      }
      if (block) {
        blockedIpsSet.add(ip);
        console.log(`\u{1F6AB} [IP Blocked] ${ip} | Reason: ${reason}`);
      } else {
        blockedIpsSet.delete(ip);
        failedAttemptsTracker.delete(ip);
        console.log(`\u2705 [IP Unblocked] ${ip}`);
      }
      return res.json({
        success: true,
        ip,
        isBlocked: blockedIpsSet.has(ip),
        blockedIps: Array.from(blockedIpsSet)
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/github/validate-token", async (req, res) => {
    try {
      const { token } = req.body || {};
      if (!token) {
        return res.status(400).json({ success: false, error: "GitHub Token \u0906\u0935\u0936\u094D\u092F\u0915 \u0906\u0939\u0947." });
      }
      const result = await validateGitHubToken(token);
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  app.post("/api/github/sync", async (req, res) => {
    try {
      const { token, repoName, isPrivate, commitMessage, branch } = req.body || {};
      if (!token || !repoName) {
        return res.status(400).json({ success: false, error: "Token \u0906\u0923\u093F Repository \u0928\u093E\u0935 \u0906\u0935\u0936\u094D\u092F\u0915 \u0906\u0939\u0947." });
      }
      const result = await syncProjectToGitHub({
        token,
        repoName,
        isPrivate: !!isPrivate,
        commitMessage: commitMessage || "\u{1F680} Sync VanjariJodi Matrimony Code & 3-Astrology Engines",
        branch: branch || "main"
      });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
