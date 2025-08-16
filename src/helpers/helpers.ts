// define the helpers functions here

export const formatNumber = (num: number) => {
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1).replace('.0', '') + 'k'
  if (num < 1000000000)
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  return (num / 1000000000).toFixed(1).replace('.0', '') + 'B'
}

// helper function to generate a first character of the input string and uppercase
export const generateDefaultProfileImage = (name: string | undefined): string | undefined => {
  if (!name) return undefined
  const firstChar = name.charAt(0).toUpperCase()
  return firstChar
}