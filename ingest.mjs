import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error("Missing Neo4j credentials in .env.local");
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function ingestData() {
  const session = driver.session();
  console.log('Connected to Neo4j. Ingesting base ontology...');

  const cypher = `
    // Create Players
    MERGE (bumrah:Player {name: "JJ Bumrah", role: "Bowler", team: "Mumbai Indians"})
    MERGE (kohli:Player {name: "V Kohli", role: "Batter", team: "Royal Challengers Bangalore"})
    MERGE (rohit:Player {name: "RG Sharma", role: "Batter", team: "Mumbai Indians"})
    MERGE (starc:Player {name: "MA Starc", role: "Bowler", team: "Kolkata Knight Riders"})

    // Create Match
    MERGE (match1:Match {id: "M001", date: "2024-04-11", stadium: "Wankhede Stadium"})
    
    // Create Matchups (Aggregated for easy GraphRAG)
    MERGE (bumrah)-[r1:BOWLED_TO {
      total_runs: 164,
      dot_balls: 39,
      wickets: 5,
      strike_rate: 110.2
    }]->(kohli)

    MERGE (starc)-[r2:BOWLED_TO {
      total_runs: 95,
      dot_balls: 45,
      wickets: 2,
      strike_rate: 125.0
    }]->(rohit)

    MERGE (bumrah)-[r3:BOWLED_TO {
      total_runs: 45,
      dot_balls: 10,
      wickets: 1,
      strike_rate: 145.0
    }]->(rohit)

    RETURN bumrah, kohli, rohit, starc
  `;

  try {
    // Clear old test data first
    await session.executeWrite(tx => tx.run('MATCH (n) DETACH DELETE n'));
    
    // Insert new data
    const res = await session.executeWrite(tx => tx.run(cypher));
    console.log(`Ingested ${res.records.length} records successfully.`);
  } catch (error) {
    console.error("Error ingesting data:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

ingestData();
