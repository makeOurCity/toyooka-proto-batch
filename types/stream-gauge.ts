export namespace StreamGauge {
  export type Record = {
    _id: number
    局番号: number
    観測所名: string
    観測時刻: string
    '河川水位[m]': number
    河川水位フラグ: number
    '10分（前回）水位変化量[m]': number
    '10分（前回）水位変化量フラグ': number
    '時間水位変化量[m]': number
    時間水位変化量フラグ: number
  }

  export type NGSI = {
    name: { value: string }
    location: { value: string }
    waterLevel: { value: number }
    waterLevelIncrease_10m: { value: number }
    waterLevelIncrease_1h: { value: number }
    dateObserved: { value: Date }
  }
}
