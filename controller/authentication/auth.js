const jwt = require('jsonwebtoken')
const secretKey = 'your-secret-key'
const dataToSnakeCase = require('../../api-helpers/lib/data_to_snake_case')
const {
  apiResponse,
} = require('../../api-helpers/v1/message/ResponseController')
const logger = require('../../api-helpers/logger/logger')
const {
  SubscriberModel,
  AuthModel,
  LookupModel,
  ProfileModel,
  sequelize,
  AddressModel,
  FieldsModel,
} = require('../../init/mysql-init')
const auth = {}

function decode(token) {
  return jwt.verify(token, secretKey)
}

auth.login = async (req, res) => {
  const { username, password, deviceId } = req.body
  console.log(req.body)
  try {
    const lookup = await LookupModel.findOne({
      where: { username: username },
      attributes: ['accountId', 'role', 'access'],
      raw: true,
    })

    if (!lookup) throw new Error('Account not found!')

    const subscriber = await SubscriberModel.findOne({
      where: { username: username, password: password },
      attributes: { exclude: ['password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Invalid Credentials!')
    const token = jwt.sign(
      { userId: subscriber.id, username: username, deviceId },
      secretKey,
      { expiresIn: '1h' }
    )

    const profile = await ProfileModel.findOne({
      where: { accountId: subscriber.id },
      attributes: {
        exclude: ['id', 'updatedAt', 'createdAt'],
      },
      raw: true,
    })

    const address = await AddressModel.findOne({
      where: { accountId: subscriber.id },
      attributes: { exclude: ['id', 'updatedAt', 'createdAt'] },
      raw: true,
    })

    // const refreshToken = jwt.sign({ token: token }, secretKey, {
    //   expiresIn: '1h',
    // })

    const decodedToken = decode(token)
    // const decodedRefreshToken = decode(refreshToken)

    const accessToken = [
      {
        token: token,
        type: 'token',
      },
      // {
      //   token: refreshToken,
      //   type: 'refreshToken',
      // },
    ]
    const fields = await FieldsModel.findAll({ raw: true })

    AuthModel.bulkCreate(accessToken)

    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: true,
          statusCode: 200,
          data: {
            accessToken: {
              token,
              iat: decodedToken.iat,
              exp: new Date(decodedToken.exp * 1000).getTime(),
            },
            // RefreshToken: {
            //   token: refreshToken,
            //   iat: decodedRefreshToken.iat,
            //   exp: decodedRefreshToken.exp,
            // },
            subscriber,
            profile,
            address,
            fields,
            ...lookup,
          },
          message: 'Successfully login',
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - subscriber login - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

auth.verify = async (req, res, next) => {
  try {
    const accessToken = req.headers['authorization']

    if (!accessToken) throw new Error('No access token provided!')

    const [type, token] = accessToken.split(' ')
    if (type !== 'Bearer') throw new Error('Invalid Token!')

    const authValid = await AuthModel.findOne({
      where: { token: token, status: 1 },
      raw: true,
    })

    console.log(authValid)

    if (!authValid) throw new Error('Authorization expired!')

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        AuthModel.update(
          {
            status: 3,
          },
          {
            where: { token: token },
            raw: true,
          }
        )

        if (err) throw new Error('Unauthorized access!')
      }
      next()
    })
  } catch (error) {
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 403,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

auth.refresh = async (req, res) => {
  const accessToken = req.headers['authorization']
  const [type, token] = accessToken.split(' ')
  const { refresh_access_token } = req.body

  try {
    const authValid = await AuthModel.findOne({
      where: { token: refresh_access_token, status: 1 },
      raw: true,
    })

    if (!authValid) throw new Error('Invalid Auth!')

    const refreshToken = jwt.sign({ refresh_access_token }, secretKey, {
      expiresIn: '1h',
    })

    AuthModel.update(
      {
        status: 3,
      },
      {
        where: { token: token },
        raw: true,
      }
    )

    const accessToken = {
      token: refreshToken,
      type: 'refreshToken',
    }

    const authRefreshTokenCreate = new AuthModel(accessToken)
    authRefreshTokenCreate.save()

    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          data: {
            refreshToken: refreshToken,
          },
          message: 'Refresh token generated',
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - auth refresh token- ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

module.exports = auth
