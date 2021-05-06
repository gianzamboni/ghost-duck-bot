import { Map } from '@interfaces/map';
import { QueryOptions } from '@interfaces/query-options';
import { PhasmoDataService } from '@services/phasmo-data';

export class Maps {
  constructor(){}

  public static all(options: QueryOptions = {}): Promise<Map[]> {
      return PhasmoDataService.getAll<Map>('map', options);
    }

  public static async getRandom(): Promise<Map> {
    const queryText = `SELECT * FROM phasmo.map
                        ORDER BY RANDOM()
                       LIMIT 1`

    let response = await PhasmoDataService.exec<Map>(queryText);
    return response[0];

  }
}