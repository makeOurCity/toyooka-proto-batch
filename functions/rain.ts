import axios from 'axios'
import { ORION_URL, SUBSCRIPTION_URL } from '../config/env-var'
import { AreaNameEN, RainAreaNames } from '../constant/area'
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
          'Fiware-Service': 'toyooka_sandbox',
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

  for (const area of RainAreaNames) {
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

export const unsubscribeRain = async () => {
  const requestToken = await getJwt()
  const { data: rainSubscriptions } = await axios.get(
    `${ORION_URL()}/v2/subscriptions/?limit=100`,
    { headers: { 'Fiware-Service': 'toyooka_sandbox' } }
  )
  for (const subscription of rainSubscriptions) {
    await axios.delete(`${ORION_URL()}/v2/subscriptions/${subscription.id}`, {
      headers: {
        Authorization: requestToken,
        'Fiware-Service': 'toyooka_sandbox',
      },
    })
  }
  console.log(rainSubscriptions.length)
  return
}

const generateRainData = async () => {
  try {
    const rowDataUrl =
      'https://data.bodik.jp/api/3/action/datastore_search?resource_id=57803024-20b4-4e8a-b5a6-4957f098a051'
    const { data } = await axios.get(rowDataUrl)
    const records = data.result.records as Rain.Record[]
    const currentDate = new Date()

    const rainLocation: { [key: string]: string } = {
      ??????: '35.54805556, 134.8205556',
      ??????: '35.39555556, 134.7566667',
      ??????: '35.6530556, 134.7627778',
      ??????: '35.3416667, 134.6766667',
      ??????: '35.3744444, 134.6436111',
      ??????: '35.4556111, 134.7300278',
      ??????: '35.4663611, 134.8701111',
      ??????: '35.62666667, 134.8155556',
      ?????????: '35.323333, 134.848333',
      ??????: '35.6291667, 134.6205556',
    }

    const generatedData: { [key: string]: Rain.NGSI } = {}
    for (const area of RainAreaNames) {
      const enName = AreaNameEN[area]
      const record = records.find((r) => r.???????????? === area)
      if (record && enName) {
        const orionId = `toyooka-rainObserved-${enName}`
        const importData: Rain.NGSI = {
          name: { value: area },
          location: { value: rainLocation[area] },
          precipitation_10m: { value: record['60?????????[mm]'] },
          precipitation_1h: { value: record['60?????????[mm]'] },
          precipitation_24h: { value: record['24????????????[mm]'] },
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
