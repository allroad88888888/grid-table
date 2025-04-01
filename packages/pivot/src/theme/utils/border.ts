import type { CSSProperties } from 'react'

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'none'
export type BorderWidth = string | number
export type BorderColor = string

export interface BorderStyleOptions {
  style?: BorderStyle
  width?: BorderWidth
  color?: BorderColor
}

/**
 * Creates a CSSProperties object with only border-left and border-bottom properties
 * @param options Border style options including style, width, and color
 * @returns CSSProperties object with border-left and border-bottom
 */
export function createBorderStyles(options: BorderStyleOptions = {}): CSSProperties {
  const { style = 'solid', width = '1px', color = 'var(--grid-border-color, #f0f0f0)' } = options

  return {
    borderLeft: `${width} ${style} ${color}`,
    borderBottom: `${width} ${style} ${color}`,
  }
}

/**
 * Merges existing styles with border styles
 * @param existingStyles Existing CSSProperties
 * @param borderOptions Border style options
 * @returns Merged CSSProperties
 */
export function mergeWithBorderStyles(
  existingStyles: CSSProperties,
  borderOptions: BorderStyleOptions = {},
): CSSProperties {
  return {
    ...existingStyles,
    ...createBorderStyles(borderOptions),
  }
}

/**
 * Removes border-left and border-bottom from existing styles
 * @param existingStyles Existing CSSProperties
 * @returns CSSProperties without border-left and border-bottom
 */
export function removeBorderStyles(existingStyles: CSSProperties): CSSProperties {
  const { borderLeft, borderBottom, ...rest } = existingStyles
  return rest
}

/**
 * Transforms style object to keep only border-left and border-bottom properties
 * and preserve all other non-border properties
 * @param styles Existing CSSProperties
 * @returns CSSProperties with only border-left, border-bottom and non-border properties
 */
export function transformToBorderLeftBottom(styles: CSSProperties): CSSProperties {
  if (!styles) return {}

  const result: Record<string, any> = {}
  const borderLeftProps: Record<string, any> = {}
  const borderBottomProps: Record<string, any> = {}

  // Process all properties
  for (const [key, value] of Object.entries(styles)) {
    // Skip null or undefined values
    if (value == null) continue

    // Keep all non-border properties
    if (!key.toLowerCase().startsWith('border')) {
      result[key] = value
      continue
    }

    // Process border-left properties
    if (
      key.toLowerCase() === 'borderleft' ||
      key.toLowerCase() === 'border-left' ||
      key.toLowerCase() === 'borderleftwidth' ||
      key.toLowerCase() === 'border-left-width' ||
      key.toLowerCase() === 'borderleftstyle' ||
      key.toLowerCase() === 'border-left-style' ||
      key.toLowerCase() === 'borderleftcolor' ||
      key.toLowerCase() === 'border-left-color'
    ) {
      borderLeftProps[key] = value
      continue
    }

    // Process border-bottom properties
    if (
      key.toLowerCase() === 'borderbottom' ||
      key.toLowerCase() === 'border-bottom' ||
      key.toLowerCase() === 'borderbottomwidth' ||
      key.toLowerCase() === 'border-bottom-width' ||
      key.toLowerCase() === 'borderbottomstyle' ||
      key.toLowerCase() === 'border-bottom-style' ||
      key.toLowerCase() === 'borderbottomcolor' ||
      key.toLowerCase() === 'border-bottom-color'
    ) {
      borderBottomProps[key] = value
      continue
    }

    // Extract values from shorthand 'border' property if no specific left/bottom properties exist
    if (
      key.toLowerCase() === 'border' ||
      key.toLowerCase() === 'borderwidth' ||
      key.toLowerCase() === 'border-width' ||
      key.toLowerCase() === 'borderstyle' ||
      key.toLowerCase() === 'border-style' ||
      key.toLowerCase() === 'bordercolor' ||
      key.toLowerCase() === 'border-color'
    ) {
      // Apply border shorthand values to left and bottom if specific properties don't exist
      if (
        key.toLowerCase() === 'border' &&
        !borderLeftProps['borderLeft'] &&
        !borderLeftProps['border-left']
      ) {
        borderLeftProps['borderLeft'] = value
      }
      if (
        key.toLowerCase() === 'border' &&
        !borderBottomProps['borderBottom'] &&
        !borderBottomProps['border-bottom']
      ) {
        borderBottomProps['borderBottom'] = value
      }

      // Apply width
      if (
        (key.toLowerCase() === 'borderwidth' || key.toLowerCase() === 'border-width') &&
        !borderLeftProps['borderLeftWidth'] &&
        !borderLeftProps['border-left-width']
      ) {
        borderLeftProps['borderLeftWidth'] = value
      }
      if (
        (key.toLowerCase() === 'borderwidth' || key.toLowerCase() === 'border-width') &&
        !borderBottomProps['borderBottomWidth'] &&
        !borderBottomProps['border-bottom-width']
      ) {
        borderBottomProps['borderBottomWidth'] = value
      }

      // Apply style
      if (
        (key.toLowerCase() === 'borderstyle' || key.toLowerCase() === 'border-style') &&
        !borderLeftProps['borderLeftStyle'] &&
        !borderLeftProps['border-left-style']
      ) {
        borderLeftProps['borderLeftStyle'] = value
      }
      if (
        (key.toLowerCase() === 'borderstyle' || key.toLowerCase() === 'border-style') &&
        !borderBottomProps['borderBottomStyle'] &&
        !borderBottomProps['border-bottom-style']
      ) {
        borderBottomProps['borderBottomStyle'] = value
      }

      // Apply color
      if (
        (key.toLowerCase() === 'bordercolor' || key.toLowerCase() === 'border-color') &&
        !borderLeftProps['borderLeftColor'] &&
        !borderLeftProps['border-left-color']
      ) {
        borderLeftProps['borderLeftColor'] = value
      }
      if (
        (key.toLowerCase() === 'bordercolor' || key.toLowerCase() === 'border-color') &&
        !borderBottomProps['borderBottomColor'] &&
        !borderBottomProps['border-bottom-color']
      ) {
        borderBottomProps['borderBottomColor'] = value
      }
    }
  }

  // Merge all properties
  return {
    ...result,
    ...borderLeftProps,
    ...borderBottomProps,
  }
}

/**
 * Extracts border-top properties from a style object
 * @param styles CSSProperties object that may contain border or border-top properties
 * @returns Object containing border-top properties
 */
export function extractBorderTopProperties(styles: CSSProperties): {
  borderTop?: string
  borderTopWidth?: string | number
  borderTopStyle?: string
  borderTopColor?: string
} {
  if (!styles) return {}

  const result: {
    borderTop?: string
    borderTopWidth?: string | number
    borderTopStyle?: string
    borderTopColor?: string
  } = {}

  // Check for direct border-top properties
  if (styles.borderTop) {
    result.borderTop = String(styles.borderTop)
    return result
  }

  // Check for individual border-top properties
  if (styles.borderTopWidth) result.borderTopWidth = styles.borderTopWidth
  if (styles.borderTopStyle) result.borderTopStyle = String(styles.borderTopStyle)
  if (styles.borderTopColor) result.borderTopColor = String(styles.borderTopColor)

  // If we found any individual border-top properties, return them
  if (Object.keys(result).length > 0) {
    return result
  }

  // If no specific border-top properties exist, use the general border properties
  if (styles.border) {
    result.borderTop = String(styles.border)
    return result
  }

  // Check for individual border properties
  if (styles.borderWidth) result.borderTopWidth = styles.borderWidth
  if (styles.borderStyle) result.borderTopStyle = String(styles.borderStyle)
  if (styles.borderColor) result.borderTopColor = String(styles.borderColor)

  return result
}

export function extractBorderRightProperties(styles: CSSProperties): {
  borderRight?: string
  borderRightWidth?: string | number
  borderRightStyle?: string
  borderRightColor?: string
} {
  if (!styles) return {}

  const result: {
    borderRight?: string
    borderRightWidth?: string | number
    borderRightStyle?: string
    borderRightColor?: string
  } = {}

  // Check for direct border-top properties
  if (styles.borderTop) {
    result.borderRight = String(styles.borderTop)
    return result
  }

  // Check for individual border-top properties
  if (styles.borderTopWidth) result.borderRightWidth = styles.borderTopWidth
  if (styles.borderTopStyle) result.borderRightStyle = String(styles.borderTopStyle)
  if (styles.borderTopColor) result.borderRightColor = String(styles.borderTopColor)

  // If we found any individual border-top properties, return them
  if (Object.keys(result).length > 0) {
    return result
  }

  // If no specific border-top properties exist, use the general border properties
  if (styles.border) {
    result.borderRight = String(styles.border)
    return result
  }

  // Check for individual border properties
  if (styles.borderWidth) result.borderRightWidth = styles.borderWidth
  if (styles.borderStyle) result.borderRightStyle = String(styles.borderStyle)
  if (styles.borderColor) result.borderRightColor = String(styles.borderColor)

  return result
}
