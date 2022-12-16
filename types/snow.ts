export namespace Snow {
  export type FallRecord = {
    観測所番号: string
    都道府県: string
    地点: string
    国際地点番号: string
    '現在時刻(年)': string
    '現在時刻(月)': string
    '現在時刻(日)': string
    '現在時刻(時)': string
    '現在時刻(分)': string
    '3時間降雪量極値更新': string
    '3時間降雪量極値更新（10年未満）': string
    '6時間降雪量極値更新': string
    '6時間降雪量極値更新（10年未満）': string
    '12時間降雪量極値更新': string
    '12時間降雪量極値更新（10年未満）': string
    '24時間降雪量極値更新': string
    '24時間降雪量極値更新（10年未満）': string
    '48時間降雪量極値更新': string
    '48時間降雪量極値更新（10年未満）': string
    '72時間降雪量極値更新': string
    '72時間降雪量極値更新（10年未満）': string
    '3時間降雪量 現在値(cm)': string
    '3時間降雪量 現在値の品質情報': string
    '3時間降雪量 今日の最大値(cm)': string
    '3時間降雪量 今日の最大値の品質情報': string
    '6時間降雪量 現在値(cm)': string
    '6時間降雪量 現在値の品質情報': string
    '6時間降雪量 今日の最大値(cm)': string
    '6時間降雪量 今日の最大値の品質情報': string
    '12時間降雪量 現在値(cm)': string
    '12時間降雪量 現在値の品質情報': string
    '12時間降雪量 今日の最大値(cm)': string
    '12時間降雪量 今日の最大値の品質情報': string
    '24時間降雪量 現在値(cm)': string
    '24時間降雪量 現在値の品質情報': string
    '24時間降雪量 今日の最大値(cm)': string
    '24時間降雪量 今日の最大値の品質情報': string
    '48時間降雪量 現在値(cm)': string
    '48時間降雪量 現在値の品質情報': string
    '48時間降雪量 今日の最大値(cm)': string
    '48時間降雪量 今日の最大値の品質情報': string
    '72時間降雪量 現在値(cm)': string
    '72時間降雪量 現在値の品質情報': string
    '72時間降雪量 今日の最大値(cm)': string
    '72時間降雪量 今日の最大値の品質情報': string
  }

  export type CoverRecord = {
    観測所番号: string
    都道府県: string
    地点: string
    国際地点番号: string
    '現在時刻(年)': string
    '現在時刻(月)': string
    '現在時刻(日)': string
    '現在時刻(時)': string
    '現在時刻(分)': string
    '現在の積雪の深さ(cm)': string
    現在の積雪の深さの品質情報: string
    '現在の積雪の深さの平年比（%）': string
    日平年値: string
    日平年値の品質情報: string
    日平年値の現象なし情報: string
    極値更新: string
    '10年未満での極値更新': string
    '昨冬までの観測史上1位の値（cm）': string
    昨冬までの観測史上1位の値の品質情報: string
    昨冬までの観測史上1位の値観測時の年: string
    昨冬までの観測史上1位の値観測時の月: string
    昨冬までの観測史上1位の値観測時の日: string
    '昨日までの12月の1位の値（cm）': string
    昨日までの12月の1位の値の品質情報: string
    昨日までの12月の1位の値観測時の年: string
    昨日までの12月の1位の値観測時の月: string
    昨日までの12月の1位の値観測時の日: string
    統計開始年: string
  }

  export type NGSI = {
    name: { value: string }
    location: { value: string }
    snowHeight: { value: number }
    snowFall_3h: { value: number }
    snowFall_6h: { value: number }
    snowFall_12h: { value: number }
    snowFall_24h: { value: number }
    snowFall_48h: { value: number }
    snowFall_72h: { value: number }
    dateObserved: { value: Date }
  }
}
