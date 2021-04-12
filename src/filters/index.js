import numbro from 'numbro'
import dayjs from 'dayjs'
import * as weekOfYear from 'dayjs/plugin/weekOfYear'
import * as quarterOfYear from 'dayjs/plugin/quarterOfYear'

export { formatDate } from '@/utils'

export const formatThousand = (n) => {
  if (n === 0) return 0
  if (!n) return ''
  const mantissa = Number.isInteger(n) ? 0 : 2 // 整数的话不保留小数点
  return numbro(n).format({
    thousandSeparated: true,
    mantissa: mantissa
  })
}

export const formatPercent = (n) => {
  if (typeof n === 'string' && Number.isNaN(Number(n))) return '-'
  return numbro(n).format({
    output: "percent",
    mantissa: 2
  })
}

export const formatTargetValue = (n) => {
  if (n === 0) return 0
  if (!n) return ''
  return numbro(n).format({
    thousandSeparated: true
  })
}

// 当前季度
export const formatCurrentQuarter = (t) => {
  dayjs.extend(quarterOfYear)
  const n = dayjs(t).quarter()
  return `${n}季度`
}

// 当年第几周
export const formatCurrentWeek = (t) => {
  dayjs.extend(weekOfYear)
  const n = dayjs(t).week()
  return `${n}周`
}
