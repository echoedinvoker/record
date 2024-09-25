import { Data, Hope, HopeMapValue } from "../types"

export const buildHopeTree = (hopes: Hope[], data: Data) => {
  const hopeMap = new Map(hopes.map(hope => [
    hope.key,
    {
      ...hope,
      children: [],
      attributes: { taskNumber: 0, estimatedDurationSum: 0, timestampSum: 0 }
    } as HopeMapValue
  ]))
  const rootHopes: HopeMapValue[] = []

  hopeMap.forEach(hope => {
    if (hope.parentKey === null) {
      rootHopes.push(hope)
    } else {
      const parent = hopeMap.get(hope.parentKey)
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

  const calculateEstimatedDurationSum = (hope: any): number => {
    const childrenEstimatedDurationSum = hope.children.reduce((sum: number, child: any) => sum + calculateEstimatedDurationSum(child), 0)
    hope.attributes.estimatedDurationSum = hope.taskOrder.reduce((sum: number, taskKey: string) => {
      const task = data.tasks[taskKey]
      return sum + (task ? task.estimatedDuration : 0)
    }, 0) + childrenEstimatedDurationSum
    return hope.attributes.estimatedDurationSum
  }

  const calculateTimestampSum = (hope: any): number => {
    const childrenTimestampSum = hope.children.reduce((sum: number, child: any) => sum + calculateTimestampSum(child), 0)
    hope.attributes.timestampSum = hope.taskOrder.reduce((sum: number, taskKey: string) => {
      const task = data.tasks[taskKey]
      return sum + (task ? task.timestampSum : 0)
    }, 0) + childrenTimestampSum
    return hope.attributes.timestamp
  }

  rootHopes.forEach(calculateTaskNumber)
  rootHopes.forEach(calculateEstimatedDurationSum)
  rootHopes.forEach(calculateTimestampSum)
  return rootHopes
}
