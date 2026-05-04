import neo4j from 'neo4j-driver';

const testConnection = async () => {
  const uri = 'neo4j+s://740bce71.databases.neo4j.io';
  // Let's try 'neo4j' as the username first, as it's the default for AuraDB
  const user = 'neo4j';
  const password = 'hvSaR2H5e0Fkqbo278uLhxjeUndB2Z6bEFuDdCeod60';

  console.log(`Connecting to ${uri}...`);
  
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  
  try {
    const serverInfo = await driver.getServerInfo();
    console.log('Connection successful!');
    console.log(serverInfo);
    
    // Test a basic write and read
    const session = driver.session();
    
    console.log('Creating test node...');
    await session.executeWrite(tx => 
      tx.run('MERGE (p:Player {name: "Test Player"}) RETURN p')
    );
    
    console.log('Reading test node...');
    const res = await session.executeRead(tx => 
      tx.run('MATCH (p:Player) RETURN p.name AS name LIMIT 1')
    );
    console.log('Found:', res.records[0].get('name'));
    
    await session.close();
  } catch (err) {
    console.error('Connection failed:', err);
    console.log('Will try username 740bce71 just in case...');
    
    try {
      const driver2 = neo4j.driver(uri, neo4j.auth.basic('740bce71', password));
      const info2 = await driver2.getServerInfo();
      console.log('Connection successful with username 740bce71!');
      console.log(info2);
      await driver2.close();
    } catch(err2) {
      console.error('Second attempt also failed:', err2);
    }
  } finally {
    await driver.close();
  }
};

testConnection();
