export function convertMillisecondsToHMS(milliseconds: number) {
  const { hours, minutes, remainingSeconds } = getHMSNumbersFromMilliseconds(milliseconds)
  return getFormattedTimeFromHMSNumbers(hours, minutes, remainingSeconds)
}

export function getHMSNumbersFromMilliseconds(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return { hours, minutes, remainingSeconds }
}

export function getFormattedTimeFromHMSNumbers(hours: number, minutes: number, remainingSeconds: number) {
  const hoursString = hours === 0 ? '' : hours < 10 ? `0${hours}h ` : `${hours}h `
  const minutesString = minutes === 0 ? '' : minutes < 10 ? `0${minutes}m ` : `${minutes}m `
  const secondsString = remainingSeconds === 0 ? '' : remainingSeconds < 10 ? `0${remainingSeconds}s ` : `${remainingSeconds}s `
  const hms = `${hoursString}${minutesString}${secondsString}`
  const removeFirstZeroHMS = hms[0] === '0' ? hms.slice(1) : hms
  const trimmedHMS = removeFirstZeroHMS.trim()
  return trimmedHMS
}

export function convertHMStoMilliseconds(hms: string) {
  const hmsArray = hms.split(' ')
  const milliseconds = hmsArray.reduce((acc, hms) => {
    if (!Number.isNaN(parseInt(hms.charAt(hms.length - 1)))) {
      return acc + parseInt(hms) * 60000
    }
    const timeUnit = hms.slice(-1)
    const timeValue = parseInt(hms.slice(0, -1))
    switch (timeUnit) {
      case 'h':
        return acc + timeValue * 3600000
      case 'm':
        return acc + timeValue * 60000
      case 's':
        return acc + timeValue * 1000
      default:
        return acc + timeValue * 60000
    }
  }, 0)
  return milliseconds
  }
