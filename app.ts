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
import { patchMobarokeData, postMobarokeData } from './functions/mobaroke'
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
app.get(
  '/post/:entity',
  async (req: express.Request, res: express.Response) => {
    try {
      switch (req.params.entity) {
        case 'rain':
          await postRainFromOpendata()
          break
        case 'stream-gauge':
          await postStreamGaugeFromOpendata()
          break
        case 'snow':
          await postSnowFromJMAdata()
          break
        case 'tracking-device':
          await postMobarokeData()
          break
        case 'road-restriction':
          const data = await postRoadRestrictionFromKintone()
          res.send(data)
          return
        case 'all':
          await postRainFromOpendata()
          await postStreamGaugeFromOpendata()
          await postSnowFromJMAdata()
          break
        default:
          res.send('failed')
          return
      }
      res.send('success')
    } catch (error) {
      console.log(error)
      res.send('failed')
    }
  }
)
app.get(
  '/patch/:entity',
  async (req: express.Request, res: express.Response) => {
    try {
      switch (req.params.entity) {
        case 'rain':
          await patchRainFromOpendata()
          break
        case 'stream-gauge':
          await patchStreamGaugeFromOpendata()
          break
        case 'snow':
          await patchSnowFromJMAdata()
          break
        case 'tracking-device':
          await patchMobarokeData()
          break
        case 'all':
          await patchRainFromOpendata()
          await patchStreamGaugeFromOpendata()
          await patchSnowFromJMAdata()
          await patchMobarokeData()
          break
        default:
          res.send('failed')
          return
      }
      res.send('success')
    } catch (error) {
      console.log(error)
      res.send('failed')
    }
  }
)
app.get(
  '/subscribe/:entity',
  async (req: express.Request, res: express.Response) => {
    try {
      switch (req.params.entity) {
        case 'rain':
          await subscribeRain()
          break
        case 'stream-gauge':
          await subscribeStreamGauge()
          break
        case 'snow':
          await subscribeSnow()
        case 'all':
          await subscribeRain()
          await subscribeStreamGauge()
          await subscribeSnow()
          break
        default:
          res.send('failed')
          return
      }
      res.send('success')
    } catch (error) {
      console.log(error)
      res.send('failed')
    }
  }
)
app.get(
  '/unsubscribe/:entity',
  async (req: express.Request, res: express.Response) => {
    try {
      switch (req.params.entity) {
        case 'rain':
          await unsubscribeRain()
          break
        case 'stream-gauge':
          await subscribeStreamGauge()
          break
        case 'snow':
          await subscribeSnow()
        case 'all':
          await subscribeRain()
          await subscribeStreamGauge()
          await subscribeSnow()
          break
        default:
          res.send('failed')
          return
      }
      res.send('success')
    } catch (error) {
      console.log(error)
      res.send('failed')
    }
  }
)

app.post('/notify', async (req: express.Request, res: express.Response) => {
  console.log(req.body)
  res.send('success')
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Start on port ${process.env.PORT}.`)
})
