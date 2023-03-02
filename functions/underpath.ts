import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { getJwt } from '../utils/auth'
import { ORION_URL } from '../config/env-var'

type NGSI = {
  name: { value: string }
  status: { value: string }
  observedAt: { value: string }
  location: {
    type: 'geo:json'
    value: {
      type: 'Point'
      coordinates: number[]
    }
  }
}

export const postUnderPath = async () => {
  try {
    const data = await retrieveUnderpathData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      const postData = {
        ...data[orionId],
        type: 'toyooka-underpath',
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
    return
  } catch (error) {
    console.log(error)
  }
}

export const patchUnderPath = async () => {
  try {
    const data = await retrieveUnderpathData()
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      await axios.put(
        `${ORION_URL()}/v2/entities/${orionId}/attrs?type=toyooka-underpath`,
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
    return
  } catch (error) {}
}

const retrieveUnderpathData = async () => {
  const list: { [key: string]: NGSI } = {}
  dayjs.extend(utc)
  dayjs.extend(timezone)
  try {
    const { data } = await axios.get('http://183.76.94.196/kansuitop.html', {
      auth: { username: 'toyooka', password: process.env.ASA_PASS! },
    })
    list['asakura-tajimasou'] = {
      name: { value: '市道浅倉たじま荘線（日高町）' },
      status: { value: parseStatus(String(data)) },
      location: {
        type: 'geo:json',
        value: { type: 'Point', coordinates: [134.770819, 35.455674] },
      },
      observedAt: { value: dayjs().tz('Asia/Tokyo').toISOString() },
    }
  } catch (error) {}

  try {
    const { data } = await axios.get('http://220.157.182.115/kansuitop.html', {
      auth: { username: 'toyooka', password: process.env.FUKU_PASS! },
    })
    list['fukusumi-nakamura'] = {
      name: { value: '福住中村線（出石町）' },
      status: { value: parseStatus(String(data)) },
      location: {
        type: 'geo:json',
        value: { type: 'Point', coordinates: [134.864479, 35.456438] },
      },
      observedAt: { value: dayjs().tz('Asia/Tokyo').toISOString() },
    }
  } catch (error) {}

  try {
    const { data } = await axios.get(
      'http://183.77.154.43:8080/kansuitop.html',
      {
        auth: { username: 'toyooka', password: process.env.KAHIRO_PASS! },
      }
    )
    list['daikai-ichikaichi'] = {
      name: { value: '市道大開一日市線（加広町）' },
      status: { value: parseStatus(String(data)) },
      location: {
        type: 'geo:json',
        value: { type: 'Point', coordinates: [134.815494, 35.551344] },
      },
      observedAt: { value: dayjs().tz('Asia/Tokyo').toISOString() },
    }
  } catch (error) {}

  return list
}

const parseStatus = (data: string) => {
  if (data.includes('進入禁止')) {
    return '進入禁止'
  } else if (data.includes('冠水注意')) {
    return '冠水注意'
  } else {
    return '異常なし'
  }
}
