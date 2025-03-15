#!/usr/bin/env node

/**
 * Nurexia CLI - Command Line Interface
 */

import blessed from 'blessed';
import blessedContrib from 'blessed-contrib';

// CLI 진입점
const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const name = args[0] || 'CLI User';

  console.log(`Hello, ${name}!`);
  console.log(blessed);
  console.log(blessedContrib);
};

// CLI 실행
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
