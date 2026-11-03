import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const issuesPath = resolve('scripts/issues.json');
const mapPath = resolve('scripts/issue-map.json');

const rawIssues = JSON.parse(readFileSync(issuesPath, 'utf-8'));
console.log(`Loaded ${rawIssues.length} issues to sync.`);

const issueMap = {};

for (const issue of rawIssues) {
  console.log(`Creating #${issue.id}: ${issue.title}...`);
  const labelsArgs = issue.labels.map(l => `--label "${l}"`).join(' ');
  // Use temporary file or escaped string for body to avoid shell escaping issues on Windows
  const tempBodyPath = resolve(`scripts/temp-body-${issue.id}.txt`);
  writeFileSync(tempBodyPath, issue.body, 'utf-8');

  try {
    const cmd = `gh issue create --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tempBodyPath}" ${labelsArgs}`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    // Output is typically https://github.com/LetoxBekdauletCrack/ledger-ai/issues/1
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
      // remove temp file
      const { unlinkSync } = await import('node:fs');
      unlinkSync(tempBodyPath);
    } catch (_) {}
  }
}

writeFileSync(mapPath, JSON.stringify(issueMap, null, 2), 'utf-8');
console.log(`Saved issue map to ${mapPath}`);
