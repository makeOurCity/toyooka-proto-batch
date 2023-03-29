import express from 'express'
import {
  patchRainFromOpendata,
  postRainFromOpendata,
  subscribeRain,
  unsubscribeRain,
} from './functions/rain'
import {
  patchSnowFromJMAdata,
  postSnowFromJMAdata,
  subscribeSnow,
} from './functions/snow'
import {
  patchStreamGaugeFromOpendata,
  postStreamGaugeFromOpendata,
  subscribeStreamGauge,
} from './functions/stream-gauge'
import { postRoadRestrictionFromKintone } from './functions/road-restriction'
import { patchMobarokeData } from './functions/mobaroke'
import schedule from 'node-schedule'
import { patchUnderPath } from './functions/underpath'
const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  }
)

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('helthy')
})

schedule.scheduleJob('*/30 * * * * *', () => {
  patchRainFromOpendata()
  patchStreamGaugeFromOpendata()
  // postRoadRestrictionFromKintone()
})

schedule.scheduleJob('0 * * * * *', () => {
  patchUnderPath()
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Start on port ${process.env.PORT}.`)
})
