import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import { env } from '../../../env/server.mjs'

const OLX_API = env.OLX_API

type Category = {
  id: number
  name: string
  path: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name as string

  if (!name)
    return res.status(400).json({ message: 'Provide a name to search' })

  // Encode url
  const uri = encodeURI(OLX_API + `/categories/find?name=${name}`)

  // Search for the category name
  const { data: searchedCategory } = await axios.get<Category[]>(uri, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.status(200).json(searchedCategory)
}
