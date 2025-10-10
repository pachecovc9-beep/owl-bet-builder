// Script temporário para atualizar paths de logos
// Executar uma vez e depois deletar

import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/data/leagues.ts';
const content = readFileSync(filePath, 'utf-8');

// Replace all /assets/ with /src/assets/
const fixed = content.replace(/logo: "\/assets\//g, 'logo: "/src/assets/');
const fixed2 = fixed.replace(/strTeamBadge: "\/assets\//g, 'strTeamBadge: "/src/assets/');

writeFileSync(filePath, fixed2, 'utf-8');

console.log('✅ Logo paths updated successfully!');
