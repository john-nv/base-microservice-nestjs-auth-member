import { ormMapping } from '@lib/common/constants';
import { IEntitiesMapMetadata } from '@lib/common/types';

export function mapEntities(entities: IEntitiesMapMetadata) {
  const map = [];
  for (const database in entities) {
    const getValue = entities[database];
    map.push(ormMapping[database].forFeature(getValue, database));
  }
  if (map.length <= 0) console.info('Empty entities map !!!!!');
  return map;
}
