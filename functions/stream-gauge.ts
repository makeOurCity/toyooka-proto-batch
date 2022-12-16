import axios from 'axios'
import { ORION_URL, SUBSCRIPTION_URL } from '../config/env-var'
import { AreaNameEN, StreamGaugeAreaNames } from '../constant/area'
import { StreamGauge } from '../types/stream-gauge'
import { getJwt } from '../utils/auth'

export const postStreamGaugeFromOpendata = async () => {
  try {
    const data = await generateStreamGaugeData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      const postData = {
        ...data[orionId],
        type: 'toyooka-streamgauge',
        id: orionId,
      }
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

export const patchStreamGaugeFromOpendata = async () => {
  try {
    const data = await generateStreamGaugeData()
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

export const subscribeStreamGauge = async () => {
  const requestToken = await getJwt()

  for (const area of StreamGaugeAreaNames) {
    const enName = AreaNameEN[area]
    await axios.post(
      `${ORION_URL()}/v2/subscriptions`,
      {
        description: `Subscribe ${enName} stream gauge history data`,
        subject: {
          entities: [
            {
              id: `toyooka-streamGaugeObserved-${enName}`,
              type: 'toyooka-streamgauge',
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
            'waterLevel',
            'waterLevelIncrease_10m',
            'waterLevelIncrease_1h',
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

const generateStreamGaugeData = async () => {
  try {
    const rowDataUrl =
      'https://data.bodik.jp/api/3/action/datastore_search?resource_id=6a6cad49-af9f-4b9a-8ac7-53e350daa609'
    const { data } = await axios.get(rowDataUrl)
    const records = data.result.records as StreamGauge.Record[]
    const currentDate = new Date()

    const streamGaugeLocation: { [key: string]: string } = {
      円山川藪崎: '35.3911111, 134.7947222',
      野垣: '35.5397222, 134.7747222',
      駄坂: '35.5238889, 134.8427778',
      矢根: '35.4638889, 134.9266667',
      八鹿: '35.4061111, 134.7727778',
      関宮: '35.3752778, 134.6461111',
      大屋: '35.3416667, 134.6761111',
      大坪: '35.3516667, 134.7577778',
      藤井: '35.4930556, 134.7838889',
      伊府: '35.4555556, 134.7294444',
      竹野: '35.6530556, 134.7627778',
      香住: '35.6291667, 134.6205556',
    }

    const generatedData: { [key: string]: StreamGauge.NGSI } = {}
    for (const area of StreamGaugeAreaNames) {
      const enName = AreaNameEN[area]
      const record = records.find((r) => r.観測所名 === area)
      if (record && enName) {
        const orionId = `toyooka-streamGaugeObserved-${enName}`
        const importData: StreamGauge.NGSI = {
          name: { value: area },
          location: { value: streamGaugeLocation[area] },
          waterLevel: { value: record['河川水位[m]'] },
          waterLevelIncrease_10m: {
            value: record['10分（前回）水位変化量[m]'],
          },
          waterLevelIncrease_1h: { value: record['時間水位変化量[m]'] },
          dateObserved: { value: currentDate },
        }
        generatedData[orionId] = importData
      }
    }
    return generatedData
  } catch (error) {
    console.log(error)
  }
}
