import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const [action, issueNumberStr, ...msgParts] = process.argv.slice(2);
const issueNumber = parseInt(issueNumberStr, 10);
const customMsg = msgParts.join(' ');

if (!action || isNaN(issueNumber)) {
  console.error('Usage: node scripts/issue-action.mjs <start|implement|devops|close> <issueNumber> [message]');
  process.exit(1);
}

const mapPath = resolve('scripts/issue-map.json');
let issueMap = {};
try {
  issueMap = JSON.parse(readFileSync(mapPath, 'utf-8'));
} catch (e) {
  console.error('Could not read issue-map.json');
}

function runGh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    console.error('gh command failed:', err.message);
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

if (action === 'start') {
  const body = "🚧 developer.md started work.";
  console.log(`Starting issue #${issueNumber}...`);
  runGh(`gh issue comment ${issueNumber} --body "${body}"`);
  console.log(`Posted start comment on #${issueNumber}`);
} else if (action === 'implement') {
  const body = `✅ Implemented: ${customMsg || 'Feature complete and verified'}. Ready for QA.`;
  console.log(`Commenting implementation on issue #${issueNumber}...`);
  runGh(`gh issue comment ${issueNumber} --body "${body}"`);
  console.log(`Posted implement comment on #${issueNumber}`);
} else if (action === 'devops') {
  const body = `🚀 DevOps Execution Update:\n\n${customMsg}`;
  console.log(`Posting devops comment on issue #${issueNumber}...`);
  runGh(`gh issue comment ${issueNumber} --body "${body}"`);
} else if (action === 'close') {
  const body = `Verified by qa-engineer.md: ${customMsg || 'All acceptance criteria met and automated tests passed.'}`;
  console.log(`Closing issue #${issueNumber}...`);
  runGh(`gh issue close ${issueNumber} --comment "${body}"`);
  if (issueMap[issueNumber]) {
    issueMap[issueNumber].status = 'closed';
    writeFileSync(mapPath, JSON.stringify(issueMap, null, 2), 'utf-8');
  }
  console.log(`Issue #${issueNumber} successfully closed and verified.`);
}

