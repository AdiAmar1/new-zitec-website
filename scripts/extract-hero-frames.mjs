import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcPath = path.join(root, "js", "hero-scroll-sequence.js");
const outDir = path.join(root, "images1", "hero-sequence");
const outJsPath = path.join(root, "js", "hero-scroll-sequence.js");

const src = fs.readFileSync(srcPath, "utf8");
const marker = "const FRAME_SOURCES = [";
const start = src.indexOf(marker);
if (start === -1) throw new Error("FRAME_SOURCES not found");

const arrayStart = start + marker.length;
let i = arrayStart;
let depth = 1;
let inString = false;
let stringChar = "";
let escaped = false;

for (; i < src.length; i++) {
  const ch = src[i];
  if (inString) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === stringChar) inString = false;
    continue;
  }
  if (ch === '"' || ch === "'") {
    inString = true;
    stringChar = ch;
    continue;
  }
  if (ch === "[") depth += 1;
  if (ch === "]") {
    depth -= 1;
    if (depth === 0) break;
  }
}

const arrayBody = src.slice(arrayStart, i);
const logic = src.slice(i + 1); // after closing ]

const frames = [];
const re = /"data:image\/jpeg;base64,([^"]+)"/g;
let match;
while ((match = re.exec(arrayBody))) {
  frames.push(match[1]);
}

if (!frames.length) throw new Error("No frames extracted");

fs.mkdirSync(outDir, { recursive: true });

const pad = String(frames.length).length;
const urls = [];

for (let n = 0; n < frames.length; n++) {
  const name = `frame-${String(n + 1).padStart(Math.max(pad, 3), "0")}.jpg`;
  const filePath = path.join(outDir, name);
  fs.writeFileSync(filePath, Buffer.from(frames[n], "base64"));
  urls.push(`images1/hero-sequence/${name}`);
}

const header = `(() => {
    // Resolve frames relative to this script so HE (/) and EN (/en/) both work.
    const scriptEl = document.currentScript;
    const FRAME_BASE = scriptEl?.dataset?.frameBase
        || new URL("../images1/hero-sequence/", scriptEl?.src || document.baseURI).href;
    const FRAME_COUNT = ${frames.length};
    const FRAME_PAD = ${Math.max(pad, 3)};
    const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
        const n = String(index + 1).padStart(FRAME_PAD, "0");
        return FRAME_BASE + "frame-" + n + ".jpg";
    });
`;

// Find the original logic starting at "const section"
const logicStart = logic.indexOf("const section = document.getElementById");
if (logicStart === -1) throw new Error("Logic start not found");

// Keep everything from blank line / const section onward, but we already have opening IIFE from header
// Original file starts with (() => { then FRAME_SOURCES then logic.
// logic currently starts with ];\n\n    const section...
const cleanedLogic = logic.slice(logic.indexOf("\n"));

const improvedPreload = `
    function preloadFrames() {
        // Load in small batches so remote visitors get progress feedback
        // and weak connections are not flooded with hundreds of requests.
        const concurrency = 6;
        let nextIndex = 0;

        return new Promise((resolve) => {
            let active = 0;

            const kick = () => {
                while (active < concurrency && nextIndex < FRAME_SOURCES.length) {
                    const index = nextIndex;
                    nextIndex += 1;
                    active += 1;

                    const image = new Image();
                    const settle = (loaded) => {
                        images[index] = loaded ? image : null;
                        loadedCount += 1;
                        updateLoading();

                        if (index === 0 && loaded) {
                            resizeCanvas();
                            renderFrame(0, true);
                        }

                        active -= 1;
                        if (loadedCount >= FRAME_SOURCES.length) {
                            resolve();
                        } else {
                            kick();
                        }
                    };

                    image.onload = () => settle(true);
                    image.onerror = () => settle(false);
                    image.src = FRAME_SOURCES[index];
                }
            };

            kick();
        });
    }
`;

// Replace the old preloadFrames function in cleanedLogic
const preloadStart = cleanedLogic.indexOf("function preloadFrames()");
const preloadEnd = cleanedLogic.indexOf("let headerRevealTimer");
if (preloadStart === -1 || preloadEnd === -1) {
  throw new Error("Could not locate preloadFrames for rewrite");
}

const finalLogic =
  cleanedLogic.slice(0, preloadStart) +
  improvedPreload.trimStart() +
  "\n\n    " +
  cleanedLogic.slice(preloadEnd).trimStart();

const out = header + finalLogic;
fs.writeFileSync(outJsPath, out);

const totalBytes = frames.reduce((s, b64) => s + Buffer.from(b64, "base64").length, 0);
console.log(JSON.stringify({
  frames: frames.length,
  outDir,
  jsBytes: Buffer.byteLength(out),
  imagesBytes: totalBytes,
  first: urls[0],
  last: urls[urls.length - 1]
}, null, 2));
