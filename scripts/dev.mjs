import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['server/index.mjs'],{stdio:'inherit',env:{...process.env,PORT:'3001'}}),spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','0.0.0.0','--port','5174'],{stdio:'inherit'})];
let closing=false;const stop=()=>{if(closing)return;closing=true;children.forEach(c=>c.kill('SIGTERM'));};
children.forEach(c=>c.on('exit',code=>{stop();process.exitCode=code||0;}));process.on('SIGINT',stop);process.on('SIGTERM',stop);
