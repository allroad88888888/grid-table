interface Description {
  [key: string]: {
    [key: string]: string
  }
}

export function covertDescToDataList(dataList: Record<string, any>[], desc: Description) {
  const descPropSet = new Set(Object.keys(desc))

  const newDataList = dataList.map((item) => {
    const next = { ...item }
    descPropSet.forEach((prop) => {
      next[prop] =
        prop in next ? (next[prop] in desc[prop] ? desc[prop][next[prop]] : undefined) : undefined
    })
    return next
  })
  return newDataList
}
