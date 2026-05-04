import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '../../IPL.csv');
const outPath = path.join(__dirname, '../public/recent_matches.json');

async function extract() {
  console.log('Extracting recent matches from IPL.csv...');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Could not find ${csvPath}`);
    return;
  }

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // Map to store player match logs: 
  // player_name -> { match_id: { date, bat_runs, balls_faced, bowl_runs, bowl_balls, wickets } }
  const playerLogs = {};

  let isHeader = true;
  let headers = [];

  for await (const line of rl) {
    if (isHeader) {
      headers = line.split(',');
      isHeader = false;
      continue;
    }

    // A simple regex to split by comma, ignoring commas inside quotes
    const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    // If the line is malformed, skip
    if (cols.length < 15) continue;

    const match_id = cols[1];
    const date = cols[2];
    const batter = cols[11]?.replace(/"/g, '');
    const bowler = cols[15]?.replace(/"/g, '');
    const runs_batter = parseInt(cols[13]) || 0;
    const runs_bowler = parseInt(cols[19]) || 0;
    const isWicket = cols[62] === 'True' || cols[62] === 'true'; // bowler_wicket
    
    // Initialize batter
    if (batter) {
      if (!playerLogs[batter]) playerLogs[batter] = {};
      if (!playerLogs[batter][match_id]) playerLogs[batter][match_id] = { date, bat_runs: 0, balls_faced: 0, bowl_runs: 0, bowl_balls: 0, wickets: 0 };
      
      playerLogs[batter][match_id].bat_runs += runs_batter;
      playerLogs[batter][match_id].balls_faced += 1;
    }

    // Initialize bowler
    if (bowler) {
      if (!playerLogs[bowler]) playerLogs[bowler] = {};
      if (!playerLogs[bowler][match_id]) playerLogs[bowler][match_id] = { date, bat_runs: 0, balls_faced: 0, bowl_runs: 0, bowl_balls: 0, wickets: 0 };
      
      playerLogs[bowler][match_id].bowl_runs += runs_bowler;
      playerLogs[bowler][match_id].bowl_balls += 1;
      if (isWicket) playerLogs[bowler][match_id].wickets += 1;
    }
  }

  // Convert map to array and sort by date descending, keeping top 10 matches
  const recentMatches = {};
  for (const player in playerLogs) {
    const matches = Object.entries(playerLogs[player]).map(([id, data]) => ({
      match_id: id,
      ...data
    }));
    
    matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    recentMatches[player] = matches.slice(0, 10);
  }

  fs.writeFileSync(outPath, JSON.stringify(recentMatches, null, 2));
  console.log(`Saved recent matches for ${Object.keys(recentMatches).length} players to ${outPath}`);
}

extract().catch(console.error);
