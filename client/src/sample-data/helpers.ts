export function createSampleDb(
  id: string,
  name: string,
  description: string,
  category: string,
  icon: string,
  schemaSql: string,
  dataSql: string,
  tableCount: number,
  rowCount: number
) {
  return { id, name, description, category, icon, schemaSql, dataSql, tableCount, rowCount };
}
