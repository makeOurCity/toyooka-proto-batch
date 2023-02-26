export namespace Mobaroke {
  export type Record = {
    ccd: string
    vno: number
    ano: number
    tno: number
    event: number
    time: string
    lat: number
    lon: number
    llat: number
    llon: number
    sp: number
    dir: number
    hi: null | number
    gps: number
    antena: number
    acc: number
  }

  export type NGSI = {
    speed: { value: number }
    direction: { value: number }
    antenaLevel: { value: number }
    active: { value: number }
    location: {
      type: 'geo:json'
      value: { type: 'Point'; coordinates: number[] }
    }
    observedAt: { value: string; type: 'DateTime' }
  }
}
