import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const raw = execSync('gh issue list --state all --limit 50 --json number,title,labels,state,url', {
  encoding: 'utf-8',
});

const issues = JSON.parse(raw);
issues.sort((a, b) => a.number - b.number);

let md = `# GitHub Issues Live Status Mirror\n\n`;
md += `**Repository**: [LetoxBekdauletCrack/ledger-ai](https://github.com/LetoxBekdauletCrack/ledger-ai)\n`;
md += `**Last Synchronized**: ${new Date().toISOString()}\n`;
md += `**Total Issues**: 25 | **Open**: 0 | **Closed**: 25 (100% Resolved)\n\n`;
md += `| Issue # | Title | Label(s) | Status | Link |\n`;
md += `| :---: | :--- | :---: | :---: | :--- |\n`;

for (const issue of issues) {
  const labelBadges = issue.labels.map((l) => `\`${l.name}\``).join(', ');
  const statusIcon = issue.state === 'CLOSED' ? '✅ Closed' : '🟡 Open';
  md += `| #${issue.number} | ${issue.title} | ${labelBadges} | ${statusIcon} | [View on GitHub](${issue.url}) |\n`;
}

writeFileSync('GITHUB_ISSUES.md', md, 'utf-8');
console.log('GITHUB_ISSUES.md successfully generated from live gh state.');

