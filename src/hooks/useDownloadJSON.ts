import * as React from "react"
import safeStringify from "safe-stringify"

export const useDownloadJSON = (data: any, fileName: string) => {
  const downloadJSON = React.useCallback(() => {
    const jsonData = new Blob([safeStringify(data, { indentation: 2 })], {
      type: "application/json",
    })
    const jsonURL = URL.createObjectURL(jsonData)
    const link = document.createElement("a")
    link.href = jsonURL
    link.download = `${fileName}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [data, fileName])
  return {
    downloadJSON,
  }
}
