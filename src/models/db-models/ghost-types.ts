import { PhasmoDataService } from '../../services/phasmo-data';
import { GhostType } from '../../interfaces/ghost-type';
import { QueryOptions } from '../../interfaces/query-options';


export class GhostTypes {
  constructor() {};

  public static all(options: QueryOptions = {}): Promise<GhostType[]> {
    return PhasmoDataService.getAll<GhostType>('ghost_type', options);
  }

  public static async get(name: string): Promise<GhostType | undefined> {
    const queryText = "SELECT * FROM phasmo.ghost_type WHERE name=$1";
    const values = [name];

    let queryResult = await PhasmoDataService.exec<GhostType>(queryText, values);

    return queryResult.length === 0 ? undefined :  queryResult[0];
  }

  public static thatGive(evidenceShortNames: string[], options: QueryOptions = {}): Promise<GhostType[]> {
    options.tableAlias = 'gt';
    let columns = PhasmoDataService.processOptions(options);
    let queryText = this.queryTextForEvidence(columns, evidenceShortNames.length);
    
    console.log(queryText)
    return PhasmoDataService.exec<GhostType>(queryText, evidenceShortNames);
  }

  private static queryTextForEvidence(columns: string, evidenceNumber: number): string {
    const joinWhere = `JOIN phasmo.ghost_gives_evidence AS  gge ON gge.ghost_id = gt.id
                  JOIN phasmo.evidence AS e ON e.id = gge.evidence_id
                  WHERE e.short_name =`;

    let queryText = `SELECT ${columns} from phasmo.ghost_type AS gt ${joinWhere}$1`
   
    if(evidenceNumber > 1) {
      for(let i = 2; i <= evidenceNumber; i++){
        queryText = `SELECT ${columns} FROM (${queryText}) AS gt ${joinWhere}$${i}`;
      }
    }

    return queryText;
  }
}