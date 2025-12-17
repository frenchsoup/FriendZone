const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const readJSON = p => JSON.parse(fs.readFileSync(path.join(dataDir, p), 'utf8'));

const league = readJSON('league_teams.json');
const payouts = readJSON('payouts.json');
const yearlyAwards = readJSON('yearlyawards.json');

// Load all prizes_*.json files
const prizeFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('prizes_') && f.endsWith('.json'));
const prizes = {};
prizeFiles.forEach(f => {
  const year = f.match(/prizes_(\d{4})\.json/)[1];
  prizes[year] = readJSON(f);
});

const payoutMap = {};
const payoutEntries = Array.isArray(payouts) ? payouts : (payouts && payouts.prizes ? payouts.prizes : []);
payoutEntries.forEach(p => { payoutMap[p.category] = Number(p.prize) || 0; });

const nameToId = {};
league.forEach(t => { nameToId[String(t.team).toLowerCase()] = t.id; nameToId[String(t.id).toLowerCase()] = t.id; });

const getTeamId = val => {
  if (!val) return null;
  const s = String(val).trim();
  if (nameToId[s.toLowerCase()]) return nameToId[s.toLowerCase()];
  return s; // maybe already an id
}

function calcWinnings(teamId, year) {
  const p = prizes[year] || {};
  let weeklyHighScore = 0;
  let survivor = 0;
  let regularSeason = 0;
  let playoffChamp = 0;
  let playoffRunnerUp = 0;
  let playoffThird = 0;

  const totalWhsPool = Number(payoutMap['Weekly High Score (Weeks 1-14)']) || 0;
  const numWeeks = (p.weeklyHighScores || []).length || 14;
  const perWeekPrize = numWeeks > 0 ? (totalWhsPool / numWeeks) : 0;
  const whsCount = (p.weeklyHighScores || []).filter(w => getTeamId(w.team) === teamId).length;
  weeklyHighScore = perWeekPrize * whsCount;

  const survivorPrize = Number(payoutMap['Survivor (Week 13 Winner)']) || 0;
  const winnerEntry = (p.survivor || [])[11];
  if (winnerEntry) {
    const winnerId = getTeamId(winnerEntry.winner || winnerEntry.team || winnerEntry);
    if (winnerId === teamId) survivor = survivorPrize;
  }

  const awards = (yearlyAwards[year] || []);
  awards.forEach(w => {
    const awardTeamId = getTeamId(w.team) || w.team;
    if (awardTeamId === teamId) {
      if (w.category === 'Regular Season Champ') regularSeason = Number(payoutMap[w.category]) || 0;
      if (w.category === 'Playoff Champ') playoffChamp = Number(payoutMap[w.category]) || 0;
      if (w.category === 'Playoff Runner Up') playoffRunnerUp = Number(payoutMap[w.category]) || 0;
      if (w.category === 'Playoff 3rd Place') playoffThird = Number(payoutMap[w.category]) || 0;
    }
  });

  return {
    weeklyHighScore,
    whsCount,
    survivor,
    regularSeason,
    playoffChamp,
    playoffRunnerUp,
    playoffThird,
    total: weeklyHighScore + survivor + regularSeason + playoffChamp + playoffRunnerUp + playoffThird
  };
}

// Gather years from prizes and yearlyAwards
const years = Array.from(new Set([ ...Object.keys(prizes), ...Object.keys(yearlyAwards) ])).sort();

const teamTotals = league.map(t => {
  const tid = t.id;
  const teamYears = (t.years || []).map(String);
  const sum = {
    team: tid,
    display: t.team,
    years: teamYears,
    weeklyHighScore: 0,
    whsCount: 0,
    survivor: 0,
    regularSeason: 0,
    playoffChamp: 0,
    playoffRunnerUp: 0,
    playoffThird: 0,
    total: 0
  };
  years.forEach(year => {
    if (!teamYears.includes(year)) return;
    const w = calcWinnings(tid, year);
    sum.weeklyHighScore += w.weeklyHighScore;
    sum.whsCount += w.whsCount;
    sum.survivor += w.survivor;
    sum.regularSeason += w.regularSeason;
    sum.playoffChamp += w.playoffChamp;
    sum.playoffRunnerUp += w.playoffRunnerUp;
    sum.playoffThird += w.playoffThird;
    sum.total += w.total;
  });
  return sum;
});

// Print summary
console.log('Computed team financials:');
const sorted = [...teamTotals].sort((a,b) => b.total - a.total);
sorted.forEach((t, i) => {
  console.log(`${i+1}. ${t.display} (${t.team}) - Total: $${t.total} - WHS: ${t.whsCount} (${t.weeklyHighScore})`);
});

// Print any teams with WHS count >0 but weeklyHighScore == 0
const suspicious = teamTotals.filter(t => t.whsCount > 0 && t.weeklyHighScore === 0);
if (suspicious.length) {
  console.log('\nTeams with WHS entries but zero WHS payout (suspicious):');
  suspicious.forEach(t => console.log(`${t.display} (${t.team}) - WHS count ${t.whsCount}`));
} else {
  console.log('\nNo suspicious WHS zero payouts found.');
}

// Also output JSON to stdout for programmatic inspection
console.log('\nJSON_OUTPUT_BEGIN');
console.log(JSON.stringify({ teamTotals, payoutMap, years }, null, 2));
console.log('JSON_OUTPUT_END');
