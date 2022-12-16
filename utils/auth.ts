require('dotenv').config()
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

export const getJwt = async () => {
  const authenticationData = {
    Username: process.env.USERNAME!,
    Password: process.env.PASSWORD!,
  }
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  )
  const poolData = {
    UserPoolId: process.env.USER_POOL_ID!,
    ClientId: process.env.APP_CLIENT_ID!,
  }
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
  const userData = {
    Username: authenticationData.Username,
    Pool: userPool,
  }
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

  return new Promise<string>((resolve, reject) =>
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async function (result: any) {
        const idToken = result.getIdToken().getJwtToken()
        resolve(idToken)
      },
      onFailure: function (err: any) {
        reject(err)
      },
    })
  )
}
