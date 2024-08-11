/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { PNG } from 'pngjs';

ffmpeg.setFfmpegPath(ffmpegPath!);

const videoPath = 'bad-apple.mp4';
const outputDir = 'frames';

// Ensure the output directory exists
if (fs.existsSync(outputDir)) {
  processFrames();
}
else {
  fs.mkdirSync(outputDir);

  // Extract frames from the video
  ffmpeg(videoPath)
    .on('end', processFrames)
    .save(`${outputDir}/frame-%03d.png`);
}

// Process the extracted frames
async function processFrames(): Promise<void> {
  const sortNumberInRegex = (a: string, b: string): number => {
    const valueA = (a.match(/\d+/) ?? [0])[0];
    const valueB = (b.match(/\d+/) ?? [0])[0];
    return +valueA - +valueB;
  };

  const files = fs
    .readdirSync(outputDir)
    .filter(file => file.endsWith('.png'))
    .sort(sortNumberInRegex);

  // ASCII characters for different brightness levels
  const asciiChars = ' .,:;i1tfLCG08@';

  for (const file of files) {
    console.clear();

    const filePath = path.join(outputDir, file);
    const buffer = fs.readFileSync(filePath);
    const png = PNG.sync.read(buffer);

    const terminalWidth = process.stdout.columns;
    const terminalHeight = process.stdout.rows;
    const scaleFactorWidth = terminalWidth / png.width;
    const scaleFactorHeight = terminalHeight / png.height;

    let asciiFrame = '';

    // Convert each pixel to an ASCII character
    for (let y = 0; y < png.height; y++) {
      if (y % Math.ceil(1 / scaleFactorHeight) === 0) {
        for (let x = 0; x < png.width; x++) {
          if (x % Math.ceil(1 / scaleFactorWidth) === 0) {
            const idx = (png.width * y + x) << 2;
            const r = png.data[idx];
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];
            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            asciiFrame += asciiChars[charIndex];
          }
        }
        asciiFrame += '\n';
      }
    }

    console.log(asciiFrame);

    await Bun.sleep(33.33);
  }
}
