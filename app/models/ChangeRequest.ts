import { ScheduleDay } from './Meta';

export type ChangeRequest = any // TODO
export type ChangeRequestParams = ScheduleDayChangeRequestParams

interface ScheduleDayChangeRequestParams {
  schedule_id: number
  type: 'schedule_days'
  change_request: Partial<ScheduleDay>
}
