import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import { env } from '../../../env/server.mjs'

const OLX_API = env.OLX_API
const USERNAME = env.OLX_USERNAME
const PASSWORD = env.OLX_PASSWORD

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const response: { data: { token?: string } } = await axios.post(
      OLX_API + '/auth/login',
      {
        username: USERNAME,
        password: PASSWORD,
        device_name: 'integration',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.data.token)
      return res.status(400).json({ message: 'No token recieved' })

    res.setHeader('Authorization', `Bearer ${response.data.token}`)

    res.status(200).json({ token: response.data.token })
  } else {
    res.status(400).end(`Method ${req.method || ''} Not Allowed`)
  }
}
