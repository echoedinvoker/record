import { Hope, HopeMapValue } from "../types"

export const buildHopeTree = (hopes: Hope[]) => {
  const hopeMap = new Map(hopes.map(hope => [
    hope.name,
    {
      ...hope,
      children: [],
      attributes: { taskNumber: 0 }
    } as HopeMapValue
  ]))
  const rootHopes: HopeMapValue[] = []

  hopeMap.forEach(hope => {
    if (hope.parentName === null) {
      rootHopes.push(hope)
    } else {
      const parent = hopeMap.get(hope.parentName)
      if (parent) {
        parent.children.push(hope)
      }
    }
  })

  const calculateTaskNumber = (hope: any): number => {
    const childrenTaskNumber = hope.children.reduce((sum: number, child: any) => sum + calculateTaskNumber(child), 0)
    hope.attributes.taskNumber = hope.taskOrder.length + childrenTaskNumber
    return hope.attributes.taskNumber
  }

  rootHopes.forEach(calculateTaskNumber)
  return rootHopes
}
