import { RunStatus, TriggerType } from './server'

export const RunStatusLanguage = {
  [RunStatus.STARTED]: `进行中`,
  [RunStatus.SUCCESS]: `成功`,
  [RunStatus.FAILURE]: `失败`,
  [RunStatus.CANCELED]: `已终止`,
}

export const TriggerTypeLanguage = {
  [TriggerType.API]: 'API',
  [TriggerType.SCHEDULED]: `定时`,
}
