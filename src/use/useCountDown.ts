import { computed, ref } from 'vue'
import { cancelRAF, rAF } from '@/utils/raf'

type CurrentTime = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  total: number
}
type UseCountDownOptions = {
  time: number // 倒计时多久
  millisecond?: boolean // 是否为毫秒级
  onchange?: (current: CurrentTime) => void // 当时间改变的回调方法
  onFinish?: () => void // 是否完成计时的回调函数
}
const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const parseTime = (time: number) => {
  // such as 一天半的话，days = 1 剩余半天由 小时和分钟表示
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total: time,
  }
}
const isSameSecond = (time1: number, time2: number) => {
  // 计算秒，假如秒数不同，就直接返回false
  return Math.floor(time1 / SECOND) === Math.floor(time2 / SECOND)
}

export function useCountDown(options: UseCountDownOptions) {
  let rafId: number
  // 倒计时结束的时间
  let endTime: number
  // 是否在计时中
  let counting: boolean
  // 需要倒计时多久
  const remain = ref(options.time)
  const current = computed(() => parseTime(remain.value))

  const pause = () => {
    counting = false
    // 取消rAF 的回调
    cancelRAF(rafId)
  }
  // 获取定时时间获取当前时间的差，就是剩余时间
  const getCurrentRemain = () => Math.max(endTime - Date.now())
  const setRemain = (value: number) => {
    // 重新设定剩余时间
    remain.value = value
    // 当发生变化了之后，就调用onChange 回调方法
    options.onchange?.(current.value)
    // 假如剩余时间已经变成0了。就暂停计时，执行 finish 回调
    if (value === 0) {
      // 暂停时间
      pause()
      options.onFinish?.()
    }
  }
  // 毫秒级别的
  const microTick = () => {
    rafId = rAF(() => {
      // 判断是否在计时
      if (counting) {
        // 设定剩余时间
        const remainRemain = getCurrentRemain()
        setRemain(remainRemain)
        if (remain.value > 0) {
          // 递归调用
          microTick()
        }
      }
    })
  }

  // 非毫秒级别的
  // 假如不在同一秒才会进行设置，否则就不设置了，能节约性能
  const macroTick = () => {
    rafId = rAF(() => {
      if (counting) {
        // 当前的剩余时间
        const remainRemain = getCurrentRemain()
        // 不在同一秒的时候才会进行设置
        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain)
        }

        if (remain.value > 0) {
          macroTick()
        }
      }
    })
  }
  const tick = () => {
    if (options.millisecond) {
      microTick()
    } else {
      macroTick()
    }
  }
  const start = () => {
    if (!counting) {
      // 表示开始计时了
      endTime = Date.now() + remain.value
      counting = true
      tick()
    }
  }
  // 先暂停，然后在重新设定剩余时间即可
  const reset = (totalTime = options.time) => {
    pause()
    remain.value = totalTime
  }
  return {
    start,
    pause,
    reset,
    current,
  }
}
