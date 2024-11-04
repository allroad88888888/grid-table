export enum RunStatus {
  STARTED = 'STARTED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CANCELED = 'CANCELED',
}

export enum TriggerType {
  API = 'API',
  SCHEDULED = 'SCHEDULED',
}

export enum Field {
  initiator = 'initiator',
  runId = 'runId',
  triggerType = 'triggerType',
  startTime = 'startTime',
  endTime = 'endTime',
  duration = 'duration',
}

export type SearchParams = {
  pageNo: number
  pageSize: number
  elementName: string

  runStatusFilter?: RunStatus[]
  triggerFilter?: TriggerType[]
  orderBy?: {
    name: Field
    asc: boolean
  }[]
} & ({ folderId?: string } | { path?: string })

export interface Info {
  /**
   * 执行id
   */
  runId: string
  triggerType: TriggerType
  initiator: {
    avatar?: string
    email?: string
    mobilePhone?: string
    nickName?: string
    status?: string
    userId?: string
    userName: string
  }
  runStatus: RunStatus
  // duration?: number
  start_time?: number
  end_time?: number
  version?: string
}

export interface BackData {
  totalCount: number
  totalPage: number
  runs: Info[]
  // 进行中的实例
  startedCount: number
  // 成功实例数
  successCount: number
  // 失败实例数
  failureCount: number
  // 已终止实例数
  canceledCount: number
}
