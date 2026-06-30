const fs = require('fs');
const content = fs.readFileSync('src/components/tabs/AdCreatorFullScreen.tsx', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let started = false;
let startLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("activeChannel === 'facebook' && (") && !started) {
    started = true;
    startLine = i + 1;
    braceCount = 1; // since we opened with (
    console.log(`Started block at line ${startLine}`);
    continue;
  }

  if (started) {
    // count open and close parens or braces
    for (let c of line) {
      if (c === '(') braceCount++;
      if (c === ')') braceCount--;
    }
    if (braceCount === 0) {
      console.log(`Ended block at line ${i + 1}`);
      console.log('Lines around end:');
      for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 5); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
      break;
    }
  }
}
