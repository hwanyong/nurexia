#!/usr/bin/env node

/**
 * Nurexia CLI - Command Line Interface
 */

// CLI 진입점
const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const name = args[0] || 'CLI User';

  console.log(`Hello, ${name}!`);
};

// CLI 실행
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
