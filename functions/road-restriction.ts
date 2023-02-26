import dayjs from 'dayjs'
import { Road, RoadRestriction } from '../types/road-restriction'
import axios from 'axios'
import { getJwt } from '../utils/auth'
import { ORION_URL } from '../config/env-var'
dayjs.locale('ja')

export const postRoadRestrictionFromKintone = async () => {
  try {
    const data = await generateRoadRestrictionData(false)
    if (!data) return
    const requestToken = await getJwt()
    for (const orionId of Object.keys(data)) {
      try {
        const postData = {
          ...data[orionId].data,
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
      } catch (error) {
        try {
          await axios.put(
            `${ORION_URL()}/v2/entities/${orionId}/attrs`,
            data[orionId].data,
            {
              headers: {
                Authorization: requestToken,
                'Fiware-Service': 'toyooka_sandbox',
                'Fiware-ServicePath': '/',
              },
            }
          )
        } catch (error) {
          console.log(error)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const generateRoadRestrictionData = async (update: boolean = true) => {
  const updatedFrom = dayjs().add(-10, 'minute').toDate()
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

  if (update) {
    records = records.filter(
      (r: any) => dayjs(r.更新日時?.value).toDate() > updatedFrom
    )
  }

  console.log(records[1])

  const generatedData: {
    [key: string]: { isNewData: boolean; data: RoadRestriction.NGSI }
  } = {}
  for (const record of records) {
    const orionId = `toyooka-roadRestriction-${record.$id.value}`
    const isNewData = record.$revision.value === '1'
    const importData: RoadRestriction.NGSI = {
      areaName: { value: record.ドロップダウン_0.value || '' },
      roadName: {
        value: record.文字列__1行__2.value || record.Event.value || '',
      },
      restrictedSection: { value: record.文字列__1行__4.value || '' },
      description: { value: record.文字列__複数行_.value || '' },
      roadType: { value: record.文字列__1行__0.value || '' },
      isRestricting: { value: record.ラジオボタン.value || '' },
      location: { value: `${record.Lat.value}, ${record.Lng.value}` },
      restrictStartDate: {
        value: record.日時.value ? dayjs(record.日時.value).toDate() : null,
      },
      restrictEndDate: {
        value: record.日時_4.value ? dayjs(record.日時_4.value).toDate() : null,
      },
      restrictReason: {
        value: record.ドロップダウン.value,
      },
      note: { value: '' },
      images: { value: [] },
    }
    generatedData[orionId] = { isNewData, data: importData }
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
