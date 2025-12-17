#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); }

const dataDir = path.join(__dirname, '..', 'data');
const leaguePath = path.join(dataDir, 'league_teams.json');
if (!fs.existsSync(leaguePath)) {
  console.error('league_teams.json not found');
  process.exit(1);
}
const league = readJSON(leaguePath);
const nameToId = {};
const idSet = new Set();
league.forEach(t => { nameToId[String(t.team).toLowerCase()] = t.id; idSet.add(t.id); });

function migrateKeepers(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return;
  const arr = readJSON(p);
  let changed = false;
  arr.forEach(item => {
    if (item.team) {
      const key = String(item.team).toLowerCase();
      if (nameToId[key]) {
        if (item.team !== nameToId[key]) {
          item.team = nameToId[key];
          changed = true;
        }
      }
    }
  });
  if (changed) {
    const backup = p + '.bak';
    fs.copyFileSync(p, backup);
    writeJSON(p, arr);
    console.log('Migrated', file, '-> backup at', backup);
  } else {
    console.log('No changes for', file);
  }
}

function migratePrizes(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return;
  const obj = readJSON(p);
  let changed = false;
  (obj.weeklyHighScores || []).forEach(s => {
    if (s.team) {
      const key = String(s.team).toLowerCase();
      if (nameToId[key] && s.team !== nameToId[key]) { s.team = nameToId[key]; changed = true; }
    }
  });
  (obj.survivor || []).forEach(e => {
    if (e.winner) {
      const key = String(e.winner).toLowerCase();
      if (nameToId[key] && e.winner !== nameToId[key]) { e.winner = nameToId[key]; changed = true; }
    }
    if (e.eliminated) {
      const key = String(e.eliminated).toLowerCase();
      if (nameToId[key] && e.eliminated !== nameToId[key]) { e.eliminated = nameToId[key]; changed = true; }
    }
  });
  if (changed) {
    const backup = p + '.bak';
    fs.copyFileSync(p, backup);
    writeJSON(p, obj);
    console.log('Migrated', file, '-> backup at', backup);
  } else {
    console.log('No changes for', file);
  }
}

function migrateYearlyAwards() {
  const p = path.join(dataDir, 'yearlyawards.json');
  if (!fs.existsSync(p)) return;
  const obj = readJSON(p);
  let changed = false;
  Object.keys(obj).forEach(year => {
    obj[year].forEach(entry => {
      if (entry.team) {
        const key = String(entry.team).toLowerCase();
        if (nameToId[key] && entry.team !== nameToId[key]) { entry.team = nameToId[key]; changed = true; }
      }
    });
  });
  if (changed) {
    const backup = p + '.bak';
    fs.copyFileSync(p, backup);
    writeJSON(p, obj);
    console.log('Migrated yearlyawards.json -> backup at', backup);
  } else {
    console.log('No changes for yearlyawards.json');
  }
}

// run migrations
['keepers_2022.json','keepers_2023.json','keepers_2024.json','keepers_2025.json'].forEach(migrateKeepers);
['prizes_2023.json','prizes_2024.json','prizes_2025.json'].forEach(migratePrizes);
migrateYearlyAwards();

console.log('Migration complete');
