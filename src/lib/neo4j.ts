import neo4j, { type Driver } from 'neo4j-driver';

const URI = process.env.NEO4J_URI || 'neo4j+s://demo.neo4jlabs.com';
const USER = process.env.NEO4J_USERNAME || 'movies';
const PASSWORD = process.env.NEO4J_PASSWORD || 'movies';

let driver: Driver | null = null;
function getDriver() {
  if (driver) return driver;
  if (!URI || !USER || !PASSWORD) {
    throw new Error('Missing Neo4j environment variables. Set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD.');
  }
  driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
  return driver;
}

export async function readGraph(cypher: string, params: Record<string, any> = {}) {
  const session = getDriver().session();
  try {
    const res = await session.executeRead(tx => tx.run(cypher, params));
    const values = res.records.map(record => record.toObject());
    return values;
  } catch (error) {
    console.error('Error executing Cypher query:', error);
    throw error;
  } finally {
    await session.close();
  }
}
