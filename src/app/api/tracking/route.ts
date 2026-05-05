import { NextResponse } from 'next/server';
import neo4j, { type Driver } from 'neo4j-driver';

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

let driver: Driver | null = null;
function getDriver() {
  if (driver) return driver;
  if (!URI || !USER || !PASSWORD) {
    throw new Error('Missing Neo4j environment variables. Set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in Vercel.');
  }
  driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  return driver;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const player = searchParams.get('player');

  const session = getDriver().session();
  try {
    let cypher = '';
    let params = {};

    if (player) {
      // Use case-insensitive CONTAINS and fallback if no deliveries found
      cypher = `
        MATCH (p:Player)-[:BOWLED]->(b:Ball)
        WHERE p.name =~ '(?i).*' + $player + '.*'
        RETURN b
      `;
      params = { player };
      const res = await session.executeRead(tx => tx.run(cypher, params));
      let deliveries = res.records.map(record => record.get('b').properties);

      // If the player is a batsman or has no tracking data, fallback to generic data
      if (deliveries.length === 0) {
        const defaultRes = await session.executeRead(tx => tx.run('MATCH (b:Ball) RETURN b LIMIT 500'));
        deliveries = defaultRes.records.map(record => record.get('b').properties);
      }
      return NextResponse.json(deliveries);
    } else {
      // Default: return up to 500 deliveries across matches
      cypher = `
        MATCH (b:Ball)
        RETURN b
        LIMIT 500
      `;
      const res = await session.executeRead(tx => tx.run(cypher));
      const deliveries = res.records.map(record => record.get('b').properties);
      return NextResponse.json(deliveries);
    }
  } catch (error: any) {
    console.error('Error fetching tracking data from Neo4j:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
