/* eslint-disable camelcase */
const {
  User,
  PersonalAccessTokens,
  Organization,
  Role,
  Permission
} = require('../database/Models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const { pluck } = require('../helpers/helperFunctions')

exports.login = async function (req, res, next) {
  try {
    const user = await User.findByLogin(req.body)
    let permissionsArray = []
    let permissions = []

    const token = jwt.sign({ data: user._id }, process.env.APP_KEY, {
      expiresIn: '5d'
    })

    if (user.roles && Array.isArray(user.roles)) {
      const arr = []
      user?.roles?.forEach((role) => {
        permissionsArray = arr.concat(role.permissions)
      })
      console.log(permissionsArray)
      const allPermissionsTemp = await Permission.find({
        _id: permissionsArray
      })
      permissions = pluck(allPermissionsTemp, 'name')
    }

    const refresh_token = crypto
      .createHash('sha256', process.env.API_KEY)
      .update(token)
      .digest('hex')
    user.refresh_token = refresh_token

    PersonalAccessTokens.create({
      token,
      refresh_token,
      user: user._id
    }).then((data) => {
      user.tokens.push(data)
      user.save()
    })
    user.permissions = permissions
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      permissions,
      token,
      refresh_token,
      user
    })
  } catch (error) {
    next(error)
  }
}

exports.register = async function (req, res, next) {
  try {
    req.body.password = await bcrypt.hashSync(req.body.password, saltRounds)
    req.body.name = req.body.first_name + ' ' + req.body.last_name

    const role = await Role.findOne({ name: 'super_admin' })
    const payload = req.body

    const organization = await Organization.create({
      org_email: payload.org_email,
      name: payload.org_name,
      address_line1: payload.address_line1,
      address_line2: payload.address_line2,
      city: payload.city,
      state: payload.state,
      pin: payload.pin,
      country: payload.country,
      country_code: payload.country_code
    })

    payload.roles = [role._id]
    const user = await User.create(payload)
    const token = jwt.sign({ data: user }, process.env.APP_KEY, {
      expiresIn: '5d'
    })
    user.token = token
    user.org_id = organization._id
    await PersonalAccessTokens.create({
      token,
      user: user._id
    })
    await user.save()
    res.status(200).json({
      status: 200,
      message: 'Created Successfully',
      data: { _id: user._id, name: user.name, email: user.email, token }
    })
  } catch (error) {
    next(error)
  }
}

exports.logout = async function (req, res, next) {
  const token = req.token
  PersonalAccessTokens.findOneAndDelete({ token }, function (err, doc) {
    if (err) next(err)
    else {
      res
        .status(200)
        .json({ status: 200, message: 'Logged Out Successfully!' })
    }
  })
}

exports.refreshToken = async function (req, res, next) {
  try {
    const refresh_token = req.body.refresh_token
    let permissionsArray = []
    let permissions = []

    if (refresh_token == null || refresh_token === '') {
      return res
        .status(400)
        .json({ status: 400, message: 'Refresh token not given!' })
    }

    const user = await User.findOne({ refresh_token }).populate('roles')

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'User Not found! with the current token'
      })
    }

    if (user.roles && Array.isArray(user.roles)) {
      const arr = []
      user?.roles?.forEach((role) => {
        permissionsArray = arr.concat(role.permissions)
      })
      const allPermissionsTemp = await Permission.find({
        _id: permissionsArray
      })
      permissions = pluck(allPermissionsTemp, 'name')
    }

    const token = jwt.sign({ data: user._id }, process.env.APP_KEY, {
      expiresIn: '5d'
    })

    const new_refresh_token = crypto
      .createHash('sha256', process.env.API_KEY)
      .update(token)
      .digest('hex')
    user.refresh_token = new_refresh_token

    await PersonalAccessTokens.find({
      token,
      refresh_token,
      user: user._id
    }).then((data) => {
      user.save()
    })

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      permissions,
      user
    })
  } catch (error) {
    next(error)
  }
}
