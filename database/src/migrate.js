const fs = require('fs');
const pg = require('@databases/pg');
const { createSecureServer } = require('http2');
const { ClientRequest } = require('http');

class DatabaseMigrator {
  constructor() {
    this.scriptsDirectory = `${__dirname}/../sql-scripts`;
    this.connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
    this.client = pg(this.connectionString);
  }

  async run() {
    console.log("Initiating migration")
    try {
      let dbVersion = await this.getDBVersion();
      await this.updateDatabase(dbVersion);
    } catch(error) {
      console.log(error);
    } finally {
      await this.end();
    }


  }

  async end() {
    await this.client.dispose();
    console.log("Migration finished")
  }

  async getDBVersion() {
    let metadaTable = await this.client.query(pg.sql`
      SELECT * FROM pg_catalog.pg_tables WHERE tablename = 'metadata'
    `);

    if(metadaTable.length === 0) {
      console.log("Database is not inizialized");
      return 0
    }

    let version = await this.client.query(pg.sql`
      SELECT value from metadata where name='version'
    `);

    console.log(`Database version: ${version[0].value}`);
    return version[0].value;
  }

  async updateDatabase(initialVersion) {
    let scripts = fs.readdirSync(this.scriptsDirectory)
                  .filter((filename) => new RegExp('.*\.sql$').test(filename));
    scripts.sort();

    for(let i = 0; i < scripts.length; i++ ) {
      let scriptVersion = scripts[i].split('-')[0];
      let scriptname = `${this.scriptsDirectory}/${scripts[i]}`;

      if(scriptVersion > initialVersion) {
        console.log("Applying script " + scriptVersion)

        await this.client.query(pg.sql.file(scriptname));

        console.log("Script applied")
      }

    }
  }
}

(async () => {
  let dbMigrator = new DatabaseMigrator();
  await dbMigrator.run();
})();
