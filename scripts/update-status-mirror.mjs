import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mapPath = resolve('scripts/issue-map.json');
const issues = JSON.parse(readFileSync(mapPath, 'utf-8'));

let md = `# GitHub Issues Live Status Mirror\n\n`;
md += `Last synchronized: ${new Date().toISOString()}\n\n`;
md += `| Issue # | Title | Label(s) | Status | Link |\n`;
md += `| :---: | :--- | :---: | :---: | :--- |\n`;

for (const id of Object.keys(issues).sort((a, b) => Number(a) - Number(b))) {
  const item = issues[id];
  const labelBadges = item.labels.map(l => `\`${l}\``).join(', ');
  const statusIcon = item.status === 'closed' ? '✅ Closed' : '🟡 Open';
  md += `| #${item.githubNumber} | ${item.title} | ${labelBadges} | ${statusIcon} | [View on GitHub](${item.url}) |\n`;
}

writeFileSync(resolve('GITHUB_ISSUES.md'), md, 'utf-8');
console.log('GITHUB_ISSUES.md updated successfully.');
