export namespace Road {
  export interface Record {
    type: string
    properties: {
      Name: string
      description: string
      altitudeMode: string
      tessellate: number
      extrude: number
      visibility: number
    }
    geometry: {
      type: string
      coordinates: number[][]
    }
  }

  export interface NGSI {
    name: { value: string; type?: string }
    roadType: { value: string; type?: string }
    location: {
      value: { type: string; coordinates: number[][] }
      type: 'geo:json'
    }
  }
}

export namespace RoadRestriction {
  export interface Record {
    添付ファイル_0: 添付ファイル0
    レコード番号: レコード番号2
    Lng: Lng
    更新者: 更新者2
    文字列__1行_: 文字列1行
    文字列__複数行__1: 文字列複数行1
    文字列__複数行__2: 文字列複数行2
    文字列__複数行_: 文字列複数行
    日時_4: 日時4
    作成者: 作成者2
    ラジオボタン: ラジオボタン2
    ドロップダウン: ドロップダウン2
    $revision: Revision
    文字列__1行__0: 文字列1行0
    文字列__1行__1: 文字列1行1
    更新日時: 更新日時2
    文字列__1行__4: 文字列1行4
    日時: 日時2
    文字列__1行__2: 文字列1行2
    ドロップダウン_0: ドロップダウン0
    添付ファイル: 添付ファイル2
    Event: Event
    作成日時: 作成日時2
    Lat: Lat
    $id: Id
  }

  export interface 添付ファイル0 {
    type: string
    value: any[]
  }

  export interface レコード番号2 {
    type: string
    value: string
  }

  export interface Lng {
    type: string
    value: string
  }

  export interface Value {
    code: string
    name: string
  }

  export interface 更新者2 {
    type: string
    value: Value
  }

  export interface 文字列1行 {
    type: string
    value: string
  }

  export interface 文字列複数行1 {
    type: string
    value: string
  }

  export interface 文字列複数行2 {
    type: string
    value: string
  }

  export interface 文字列複数行 {
    type: string
    value: string
  }

  export interface 日時4 {
    type: string
    value: Date
  }

  export interface Value2 {
    code: string
    name: string
  }

  export interface 作成者2 {
    type: string
    value: Value2
  }

  export interface ラジオボタン2 {
    type: string
    value: string
  }

  export interface ドロップダウン2 {
    type: string
    value: string
  }

  export interface Revision {
    type: string
    value: string
  }

  export interface 文字列1行0 {
    type: string
    value: string
  }

  export interface 文字列1行1 {
    type: string
    value: string
  }

  export interface 更新日時2 {
    type: string
    value: Date
  }

  export interface 文字列1行4 {
    type: string
    value: string
  }

  export interface 日時2 {
    type: string
    value: Date
  }

  export interface 文字列1行2 {
    type: string
    value: string
  }

  export interface ドロップダウン0 {
    type: string
    value: string
  }

  export interface 添付ファイル2 {
    type: string
    value: any[]
  }

  export interface Event {
    type: string
    value: string
  }

  export interface 作成日時2 {
    type: string
    value: Date
  }

  export interface Lat {
    type: string
    value: string
  }

  export interface Id {
    type: string
    value: string
  }

  export type NGSI = {
    areaName: { value: string; type?: string }
    roadType: { value: string; type?: string }
    roadName: { value: string; type?: string }
    location: { value: string | null; type?: string }
    restrictedSection: { value: string; type?: string }
    restrictReason: { value: string; type?: string }
    description: { value: string; type?: string }
    restrictStartDate: { value: Date | null; type?: string }
    restrictEndDate: { value: Date | null; type?: string }
    note: { value: string; type?: string }
    images: { value: string[]; type?: string }
    isRestricting: { value: boolean }
  }
}
