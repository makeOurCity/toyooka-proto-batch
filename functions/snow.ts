import axios from 'axios'
import { parse } from 'papaparse'
import { ORION_URL, SUBSCRIPTION_URL } from '../config/env-var'
import { AreaNameEN, SnowAreaNames } from '../constant/area'
import { Snow } from '../types/snow'
import { getJwt } from '../utils/auth'

export const postSnowFromJMAdata = async () => {
  try {
    const data = await generateSnowData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      const postData = { ...data[orionId], type: 'toyooka-snow', id: orionId }
      await axios.post(`${ORION_URL()}/v2/entities`, postData, {
        headers: {
          Authorization: requestToken,
          'Fiware-Service': 'toyooka_sandbox',
          'Fiware-ServicePath': '/',
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const patchSnowFromJMAdata = async () => {
  try {
    const data = await generateSnowData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      await axios.put(
        `${ORION_URL()}/v2/entities/${orionId}/attrs`,
        data[orionId],
        {
          headers: {
            Authorization: requestToken,
            'Fiware-Service': 'toyooka_sandbox',
            'Fiware-ServicePath': '/',
          },
        }
      )
    }
  } catch (error) {
    console.log(error)
  }
}

export const subscribeSnow = async () => {
  const requestToken = await getJwt()

  for (const area of SnowAreaNames) {
    const enName = AreaNameEN[area]
    await axios.post(
      `${ORION_URL()}/v2/subscriptions`,
      {
        description: `Subscribe ${enName} snow history data`,
        subject: {
          entities: [
            {
              id: `toyooka-snowObserved-${enName}`,
              type: 'toyooka-snow',
            },
          ],
          condition: {
            attrs: ['dateObserved'],
          },
        },
        notification: {
          http: {
            url: SUBSCRIPTION_URL(),
          },
          attrs: [
            'snowHeight',
            'snowFall_3h',
            'snowFall_6h',
            'snowFall_12h',
            'snowFall_24h',
            'snowFall_48h',
            'snowFall_72h',
          ],
          attrsFormat: 'legacy',
        },
        expires: '2040-01-01T14:00:00.00Z',
        throttling: 5,
      },
      {
        headers: {
          Authorization: requestToken,
          'Fiware-Service': 'toyooka_sandbox',
        },
      }
    )
  }
}

const generateSnowData = async () => {
  try {
    const rowFallDataUrl =
      'https://www.data.jma.go.jp/stats/data/mdrr/snc_rct/alltable/sndall00_rct.csv'
    const { data } = await axios.get(rowFallDataUrl, {
      responseType: 'arraybuffer',
    })
    const falldata: Snow.FallRecord[] = parse(
      new TextDecoder('shift-jis').decode(data),
      { header: true }
    ).data as any

    const rowCoverDataUrl =
      'https://www.data.jma.go.jp/obd/stats/data/mdrr/snc_rct/alltable/snc00_rct.csv'
    const { data: coverData } = await axios.get(rowCoverDataUrl, {
      responseType: 'arraybuffer',
    })
    const coverdata: Snow.CoverRecord[] = parse(
      new TextDecoder('shift-jis').decode(coverData),
      { header: true }
    ).data as any

    const currentDate = new Date()

    const snowLocation: { [key: string]: string } = {
      豊岡: '35.54805556, 134.8205556',
      香住: '35.6291667, 134.6205556',
      兎和野高原: '35.431666, 134.583333',
      和田山: '35.323333, 134.848333',
    }

    const generatedData: { [key: string]: Snow.NGSI } = {}
    for (const area of SnowAreaNames) {
      const enName = AreaNameEN[area]
      const coverRecord = coverdata.find(
        (cd) => cd.都道府県 === '兵庫県' && cd.地点.includes(area)
      )
      const fallRecord = falldata.find(
        (cd) => cd.都道府県 === '兵庫県' && cd.地点.includes(area)
      )
      if (coverRecord && fallRecord && enName) {
        const orionId = `toyooka-snowObserved-${enName}`
        const importData: Snow.NGSI = {
          name: { value: area },
          location: { value: snowLocation[area] },
          snowHeight: { value: Number(coverRecord['現在の積雪の深さ(cm)']) },
          snowFall_3h: { value: Number(fallRecord['3時間降雪量 現在値(cm)']) },
          snowFall_6h: { value: Number(fallRecord['6時間降雪量 現在値(cm)']) },
          snowFall_12h: {
            value: Number(fallRecord['12時間降雪量 現在値(cm)']),
          },
          snowFall_24h: {
            value: Number(fallRecord['24時間降雪量 現在値(cm)']),
          },
          snowFall_48h: {
            value: Number(fallRecord['48時間降雪量 現在値(cm)']),
          },
          snowFall_72h: {
            value: Number(fallRecord['72時間降雪量 現在値(cm)']),
          },
          dateObserved: { value: currentDate },
        }
        generatedData[orionId] = importData
      }
    }
    return generatedData
  } catch (error) {
    console.log(error)
    return null
  }
}
