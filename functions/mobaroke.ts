import axios from 'axios'
import { Mobaroke } from '../types/mobaroke'
import dayjs from 'dayjs'
import { ORION_URL } from '../config/env-var'
import { getJwt } from '../utils/auth'

export const postMobarokeData = async () => {
  try {
    const data = await retrieveAndParseMobarokeData()
    const ids = Object.keys(data)
    const requestToken = await getJwt()
    for (const id of ids) {
      const postData = { ...data[id], type: 'toyooka-tracking-device', id: id }
      try {
        await axios.post(`${ORION_URL()}/v2/entities`, postData, {
          headers: {
            Authorization: requestToken,
            'Fiware-Service': 'toyooka_sandbox',
            'Fiware-ServicePath': '/',
          },
        })
      } catch (_) {}
    }
  } catch (error) {
    console.log(error)
  }
}

export const patchMobarokeData = async () => {
  try {
    const data = await retrieveAndParseMobarokeData()
    const ids = Object.keys(data)
    const requestToken = await getJwt()
    for (const id of ids) {
      try {
        await axios.put(
          `${ORION_URL()}/v2/entities/${id}/attrs?type=toyooka-tracking-device`,
          data[id],
          {
            headers: {
              Authorization: requestToken,
              'Fiware-Service': 'toyooka_sandbox',
              'Fiware-ServicePath': '/',
            },
          }
        )
      } catch (_) {}
    }
  } catch (error) {
    console.log(error)
  }
}

const retrieveAndParseMobarokeData = async () => {
  try {
    const token = await login()
    const { data } = await axios.get(
      `https://apitest.mloca.com/v2/mobile/states?token=${token}&ver=2.0`
    )
    const list = data.states as Mobaroke.Record[]
    const parsedList: { [key: string]: Mobaroke.NGSI } = {}
    for (const item of list) {
      const id = String(item.ano)
      parsedList[id] = {
        speed: { value: item.sp },
        direction: { value: item.dir },
        antenaLevel: { value: item.antena },
        active: { value: item.acc },
        location: {
          type: 'geo:json',
          value: {
            type: 'Point',
            coordinates: [
              Number((item.lon / 3600000).toFixed(8)),
              Number((item.lat / 3600000).toFixed(8)),
            ],
          },
        },
        observedAt: { value: dayjs(item.time).toISOString(), type: 'DateTime' },
      }
    }
    return parsedList
  } catch (error) {
    throw error
  }
}

const login = async () => {
  try {
    const { data } = await axios.post(
      'https://apitest.mloca.com/v2/auth/login',
      {
        client: process.env.MOBAROKE_CLIENT,
        key: process.env.MOBAROKE_KEY,
        ver: '2.0',
      }
    )
    return data.token as string
  } catch (error) {
    throw error
  }
}
