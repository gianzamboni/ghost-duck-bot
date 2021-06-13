import { Pool } from 'pg';

import { QueryOptions } from '@interfaces/query-options';


export class PhasmoDataService {

  private static pool: Pool;

  private constructor() {}

  public static init(): void {
    if(!this.pool) {
      this.pool = new Pool();
    }
  }

  public static async getAll<T>(tableName: string, options: QueryOptions = {}): Promise<T[]> {
    let columns = this.processOptions(options);
    const queryText = `SELECT ${columns} FROM ${tableName} ORDER BY name ASC`;
    return this.exec<T>(queryText);
  }

  public static async exec<T>(queryText: string, values: any[] = []): Promise<T[]> {
    let queryResult = await this.pool.query(queryText, values);
    return queryResult.rows as T[];
  }

  public static processOptions(options: QueryOptions) : string {
    const tableAlias = options.tableAlias? options.tableAlias + '.' : '';

    let columns = '*';
    if(options.attr) {
      columns = options.attr.reduce((prev, current) => prev + ', ' + tableAlias + current, tableAlias + 'id');
    }

    return columns;
  }

}