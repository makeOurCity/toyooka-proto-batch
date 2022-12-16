export const ORION_URL = () => {
  return process.env.ORION_URL_SANDBOX || process.env.ORION_URL
}

export const COMET_URL = () => {
  return process.env.COMET_URL_SANDBOX || process.env.COMET_URL
}

export const SUBSCRIPTION_URL = () => {
  return process.env.SUBSCRIPTION_URL_SANDBOX || process.env.SUBSCRIPTION_URL
}
