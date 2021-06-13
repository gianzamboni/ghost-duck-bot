import { Evidence } from '@interfaces/evidence';
import { GhostType } from '@interfaces/ghost-type'; 
import { QueryOptions } from '@interfaces/query-options';
import { PhasmoDataService } from '@services/phasmo-data';


export class Evidences {
  constructor() {}
  
  public static all(options: QueryOptions = {}): Promise<Evidence[]> {
    return PhasmoDataService.getAll<Evidence>('evidence', options);
  }

  public static givenBy(ghostType: GhostType): Promise<Evidence[]> {
    let queryText = `SELECT e.id, e.name, e.short_name 
                      FROM phasmo.evidence as e
                        JOIN phasmo.ghost_gives_evidence as gge ON gge.evidence_id = e.id
                        JOIN phasmo.ghost_type as gt ON gt.id = gge.ghost_id
                     WHERE gt.id=$1`
    
    const values = [ ghostType.id ];
    console.log(queryText)
    return PhasmoDataService.exec<Evidence>(queryText, values);
  }

}