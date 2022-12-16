export namespace Rain {
  export type Record = {
    _id: number
    局番号: number
    観測所名: string
    観測時刻: string
    '10分雨量[mm]': number
    '10分雨量フラグ': number
    '60分雨量[mm]': number
    '60分雨量フラグ': number
    '24時間雨量[mm]': number
    '24時間雨量フラグ': number
    '累加雨量[mm]': number
    累加雨量フラグ: number
    '降雨（累加雨量）開始時刻': string
    '降雨（累加雨量）開始時刻フラグ': number
  }

  export type NGSI = {
    name: { value: string }
    location: { value: string }
    precipitation_10m: { value: number }
    precipitation_1h: { value: number }
    precipitation_24h: { value: number }
    dateObserved: { value: Date }
  }
}
