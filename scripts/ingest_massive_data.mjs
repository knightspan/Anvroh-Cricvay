import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error("Missing Neo4j credentials in .env.local");
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function ingestMassiveData() {
  const session = driver.session();
  console.log('Connected to Neo4j. Ingesting massive datasets...');

  try {
    // 1. Clear database
    console.log('Clearing existing data...');
    await session.executeWrite(tx => tx.run('MATCH (n) DETACH DELETE n'));
    
    // 2. Load JSON files
    console.log('Reading JSON files...');
    const statsPath = path.join(__dirname, '../public/player_stats.json');
    const trackingPath = path.join(__dirname, '../public/tracking_data.json');
    
    const players = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    const deliveries = JSON.parse(fs.readFileSync(trackingPath, 'utf8'));
    
    // Create constraint for performance (ignore if exists)
    try {
      await session.executeWrite(tx => tx.run('CREATE CONSTRAINT player_name IF NOT EXISTS FOR (p:Player) REQUIRE p.name IS UNIQUE'));
    } catch(e) {}

    // 3. Ingest Players
    console.log(`Ingesting ${players.length} players...`);
    const playerCypher = `
      UNWIND $players AS p
      MERGE (player:Player {name: p.name})
      SET player += {
        matches: p.matches,
        totalRuns: p.totalRuns,
        timesOut: p.timesOut,
        ballsFaced: p.ballsFaced,
        highestScore: p.highestScore,
        fifties: p.fifties,
        hundreds: p.hundreds,
        average: toFloat(p.average),
        strikeRate: toFloat(p.strikeRate)
      }
    `;
    await session.executeWrite(tx => tx.run(playerCypher, { players }));

    // Extract unique bowlers from deliveries if they don't exist in players list
    const uniqueBowlers = [...new Set(deliveries.map(d => d.bowler))];
    const newBowlers = uniqueBowlers.filter(b => !players.find(p => p.name === b));
    if (newBowlers.length > 0) {
       await session.executeWrite(tx => tx.run(`
          UNWIND $bowlers AS b
          MERGE (:Player {name: b, role: "Bowler"})
       `, { bowlers: newBowlers }));
    }

    // 4. Ingest Deliveries
    console.log(`Ingesting ${deliveries.length} deliveries... (this might take a moment)`);
    // Batch deliveries to avoid massive single transactions
    const BATCH_SIZE = 1000;
    for (let i = 0; i < deliveries.length; i += BATCH_SIZE) {
      const batch = deliveries.slice(i, i + BATCH_SIZE);
      const deliveryCypher = `
        UNWIND $batch AS d
        MATCH (bowler:Player {name: d.bowler})
        CREATE (ball:Ball {
          id: d.id,
          runs: d.runs,
          isWicket: d.isWicket,
          isBoundary: d.isBoundary,
          pitchX: d.pitchX,
          pitchY: d.pitchY,
          stumpX: d.stumpX,
          stumpY: d.stumpY,
          wagonAngle: d.wagonAngle,
          wagonDistance: d.wagonDistance,
          bowlingType: d.bowlingType
        })
        CREATE (bowler)-[:BOWLED]->(ball)
      `;
      await session.executeWrite(tx => tx.run(deliveryCypher, { batch }));
      process.stdout.write(`\rIngested batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(deliveries.length/BATCH_SIZE)}`);
    }
    console.log('\nData ingestion complete!');

  } catch (error) {
    console.error("Error ingesting data:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

ingestMassiveData();
