#!/usr/bin/env node

import { Command } from 'commander';
import { registerSyncCommands } from './commands/sync.js';
import { registerClassifyCommands } from './commands/classify.js';
import { registerQueryCommands } from './commands/query.js';
import { registerReportCommands } from './commands/report.js';
import { registerRulesCommands } from './commands/rules.js';
import { registerDemoCommands } from './commands/demo.js';

const program = new Command();

program
  .name('ytfi')
  .description('YouTube Feedback Intel — Collect and analyze YouTube comment feedback')
  .version('1.0.0');

registerSyncCommands(program);
registerClassifyCommands(program);
registerQueryCommands(program);
registerReportCommands(program);
registerRulesCommands(program);
registerDemoCommands(program);

program.parse();
