import neo4j from 'neo4j-driver';

const URI = process.env.NEO4J_URI || 'neo4j+s://demo.neo4jlabs.com';
const USER = process.env.NEO4J_USERNAME || 'movies';
const PASSWORD = process.env.NEO4J_PASSWORD || 'movies';

export const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

export async function readGraph(cypher: string, params: Record<string, any> = {}) {
  const session = driver.session();
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
