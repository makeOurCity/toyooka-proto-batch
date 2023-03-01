import dayjs from 'dayjs'
import { Road, RoadRestriction } from '../types/road-restriction'
import axios from 'axios'
import { getJwt } from '../utils/auth'
import { ORION_URL } from '../config/env-var'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export const postRoadRestrictionFromKintone = async () => {
  try {
    const list = await generateRoadRestrictionData()
    const requestToken = await getJwt()
    for (const orionId of Object.keys(list)) {
      const data = list[orionId]
      if (data.isNewData) {
        try {
          const postData = {
            ...list[orionId].data,
            type: 'toyooka-road-restriction',
            id: orionId,
          }
          await axios.post(`${ORION_URL()}/v2/entities`, postData, {
            headers: {
              Authorization: requestToken,
              'Fiware-Service': 'toyooka_sandbox',
              'Fiware-ServicePath': '/',
            },
          })
        } catch (error) {}
      } else if (data.isUpdatedData) {
        try {
          await axios.put(
            `${ORION_URL()}/v2/entities/${orionId}/attrs`,
            list[orionId].data,
            {
              headers: {
                Authorization: requestToken,
                'Fiware-Service': 'toyooka_sandbox',
                'Fiware-ServicePath': '/',
              },
            }
          )
        } catch (error) {}
      }
    }
    return
  } catch (error) {
    console.log(error)
  }
}

const generateRoadRestrictionData = async () => {
  const res = await fetch(
    'https://toyooka-city.cybozu.com/k/v1/records.json?app=500',
    {
      method: 'GET',
      headers: {
        'X-Cybozu-API-Token': 'x1qvWm9wXyCpLC01v8e00gP7MPfsbDuPB5Op0jZb',
      },
    }
  )
  let { records } = await res.json()

  dayjs.extend(utc)
  dayjs.extend(timezone)

  const generatedData: {
    [key: string]: {
      isNewData: boolean
      isUpdatedData: boolean
      data: RoadRestriction.NGSI
    }
  } = {}
  for (const record of records) {
    const orionId = `toyooka-roadRestriction-${record.$id.value}`
    const isNewData =
      record.$revision.value === '1' &&
      dayjs().diff(record.作成日時.value) < 20000
    const isUpdatedData =
      record.$revision.value !== '1' &&
      dayjs().diff(record.更新日時.value) < 20000
    const importData: RoadRestriction.NGSI = {
      areaName: { value: record.areaName.value || '' },
      roadName: {
        value: record.Event.value || '',
      },
      restrictedSection: { value: record.restrictedSection.value || '' },
      description: { value: record.description.value || '' },
      roadType: { value: record.roadType.value || '' },
      status: { value: record['規制実施状況'].value || '' },
      location: { value: `${record.Lat.value}, ${record.Lng.value}` },
      restrictStartDate: {
        value: record.restrictStartDate.value
          ? dayjs.tz(record.restrictStartDate.value, 'Asia/Tokyo').toISOString()
          : null,
      },
      restrictEndDate: {
        value: record.restrictEndDate.value
          ? dayjs.tz(record.restrictEndDate.value, 'Asia/Tokyo').toISOString()
          : null,
      },
      restrictReason: {
        value: record.restrictReason.value,
      },
      note: { value: record.note.value },
      images: { value: [] },
    }
    generatedData[orionId] = { isNewData, isUpdatedData, data: importData }
  }

  return generatedData
}

const restrictReasonCodeParser2 = (value: number) => {
  switch (value) {
    case 1:
      return '浸水'
    case 2:
      return '土砂崩れ'
    case 3:
      return '倒木'
    default:
      return ''
  }
}

const restrictReasonCodeParser = (value: string) => {
  switch (value) {
    case '冠水':
      return 1
    case '土砂崩れ':
      return 2
    case '倒木':
      return 3
    case '道路陥没':
      return 4
    case '舗装剥離':
      return 5
    case '積雪':
      return 6
    default:
      return 0
  }
}
