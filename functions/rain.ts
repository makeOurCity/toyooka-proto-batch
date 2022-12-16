import axios from 'axios'
import { ORION_URL, SUBSCRIPTION_URL } from '../config/env-var'
import { AreaNameEN, AreaNames } from '../constant/area'
import { Rain } from '../types/rain'
import { getJwt } from '../utils/auth'

export const postRainFromOpendata = async () => {
  try {
    const data = await generateRainData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      const postData = {
        ...data[orionId],
        type: 'toyooka-rain',
        id: orionId,
      }
      await axios.post(`${ORION_URL()}/v2/entities`, postData, {
        headers: {
          Authorization: requestToken,
          'Fiware-Service': 'toyooka_2022',
          'Fiware-ServicePath': '/',
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const patchRainFromOpendata = async () => {
  try {
    const data = await generateRainData()
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

export const subscribeRain = async () => {
  const requestToken = await getJwt()

  for (const area of AreaNames) {
    const enName = AreaNameEN[area]
    await axios.post(
      `${ORION_URL()}/v2/subscriptions`,
      {
        description: `Subscribe ${enName} rain history data`,
        subject: {
          entities: [
            {
              id: `toyooka-rainObserved-${enName}`,
              type: 'toyooka-rain',
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
          attrs: ['precipitation_10m', 'precipitation_1h', 'precipitation_24h'],
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

const generateRainData = async () => {
  try {
    const rowDataUrl =
      'https://data.bodik.jp/api/3/action/datastore_search?resource_id=57803024-20b4-4e8a-b5a6-4957f098a051'
    const { data } = await axios.get(rowDataUrl)
    const records = data.result.records as Rain.Record[]
    const currentDate = new Date()

    const rainLocation: { [key: string]: string } = {
      豊岡: '35.54805556, 134.8205556',
      八鹿: '35.39555556, 134.7566667',
      竹野: '35.6530556, 134.7627778',
      大屋: '35.3416667, 134.6766667',
      関宮: '35.3744444, 134.6436111',
      伊府: '35.4556111, 134.7300278',
      出石: '35.4663611, 134.8701111',
    }

    const generatedData: { [key: string]: Rain.NGSI } = {}
    for (const area of AreaNames) {
      const enName = AreaNameEN[area]
      const record = records.find((r) => r.観測所名 === area)
      if (record && enName) {
        const orionId = `toyooka-rainObserved-${enName}`
        const importData: Rain.NGSI = {
          name: { value: area },
          location: { value: rainLocation[area] },
          precipitation_10m: { value: record['60分雨量[mm]'] },
          precipitation_1h: { value: record['60分雨量[mm]'] },
          precipitation_24h: { value: record['24時間雨量[mm]'] },
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
