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
        case 'all':
          await patchRainFromOpendata()
          await patchStreamGaugeFromOpendata()
          await patchSnowFromJMAdata()
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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Start on port ${process.env.PORT}.`)
})
