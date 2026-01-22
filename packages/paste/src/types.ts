export type PasteItemType =
  | 'text'
  | 'html'
  | 'image'
  | 'rtf'
  | 'csv'
  | 'json'
  | 'url'
  | 'file'
  | 'unknown'

export type PasteItem = {
  id: string
  type: PasteItemType
  content: string
  mimeType: string
  fileName?: string
  fileSize?: number
}

export type PasteResult = {
  items: PasteItem[]
  images: string[]
}
