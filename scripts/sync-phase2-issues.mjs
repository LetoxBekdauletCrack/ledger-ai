import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const issuesPath = resolve('scripts/issues.json');
const mapPath = resolve('scripts/issue-map.json');

const rawIssues = JSON.parse(readFileSync(issuesPath, 'utf-8'));
let issueMap = JSON.parse(readFileSync(mapPath, 'utf-8'));

// Filter only new issues (26..31)
const phase2Issues = rawIssues.filter(i => i.id >= 26);
console.log(`Syncing ${phase2Issues.length} Phase 2 issues...`);

for (const issue of phase2Issues) {
  console.log(`Creating #${issue.id}: ${issue.title}...`);
  const labelsArgs = issue.labels.map(l => `--label "${l}"`).join(' ');
  const tempBodyPath = resolve(`scripts/temp-body-${issue.id}.txt`);
  writeFileSync(tempBodyPath, issue.body, 'utf-8');

  try {
    const cmd = `gh issue create --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tempBodyPath}" ${labelsArgs}`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    const match = output.match(/issues\/(\d+)/);
    const githubNumber = match ? parseInt(match[1], 10) : issue.id;

    issueMap[issue.id] = {
      localId: issue.id,
      githubNumber: githubNumber,
      title: issue.title,
      labels: issue.labels,
      url: output,
      status: 'open'
    };
    console.log(`  -> Created as GitHub Issue #${githubNumber} (${output})`);
  } catch (err) {
    console.error(`Error creating issue #${issue.id}:`, err.message);
    if (err.stderr) console.error(err.stderr.toString());
    process.exit(1);
  } finally {
    try {
      const { unlinkSync } = await import('node:fs');
      unlinkSync(tempBodyPath);
    } catch (_) {}
  }
}

writeFileSync(mapPath, JSON.stringify(issueMap, null, 2), 'utf-8');
console.log(`Updated issue map in ${mapPath}`);
