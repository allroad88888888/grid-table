export const EmptyArray: number[] = []

export const Options: Record<
    'row' | 'column',
  {
    lengthProp: 'height' | 'width'
    positionProp: 'scrollTop' | 'scrollLeft'
    stateProp: 'stateScrollTop' | 'stateScrollLeft'
  }
> = {
  row: {
    lengthProp: 'height',
    positionProp: 'scrollTop',
    stateProp: 'stateScrollTop',
  },
  column: {
    lengthProp: 'width',
    positionProp: 'scrollLeft',
    stateProp: 'stateScrollLeft',

  },
}
