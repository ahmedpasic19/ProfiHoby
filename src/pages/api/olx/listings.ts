import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

import { env } from '../../../env/server.mjs'

const prisma = new PrismaClient()

const OLX_API = env.OLX_API
const USERNAME = env.OLX_USERNAME
const PASSWORD = env.OLX_PASSWORD

type City = {
  id: number
  name: string
  location: {
    lat: string
    lon: string
  }
  canton_id: number
}

type Canton = {
  id: number
  name: string
  cities: City[]
}

type Entitet = {
  id: number
  name: string
  code: string
  cantons: Canton[]
}

type Country = { id: number; name: string; code: string }

type Category = {
  id: number
  count: 1148
  name: string
  parent_categories: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (!req.query.id)
        return res.status(400).json({ message: 'Article id required' })

      // GET the token from remote api
      const auth: { data: { token?: string } } = await axios.post(
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

      if (!auth.data.token)
        return res.status(403).json({ message: 'No token recieved' })

      // GET new article
      const article = await prisma.article.findUnique({
        where: { id: typeof req.query.id === 'string' ? req.query.id : '' },
      })

      if (!article)
        return res.status(404).json({ message: 'Article not found' })

      // GET city form olx api
      // const cities: {
      //   data: { data: Entitet[] }
      // } = await axios.get(OLX_API + '/cities')

      // if (!cities.data)
      //   return res.status(500).json({ message: 'Cannot GET /cities' })
      // console.log(cities.data)

      // const entity = cities?.data?.data?.find(
      //   (entity) => entity.code === 'FBiH'
      // )
      // console.log('entity: ', entity)
      // const cantoon = entity?.cantons.find(
      //   (cantoon) => (cantoon.name = 'Zeničko-dobojski kanton')
      // )
      // console.log('cantoon: ', cantoon)
      // console.log('cantoon cities: ', cantoon?.cities)
      // // Find "Tesanj" in cities response
      // const city = cantoon?.cities?.find((city) => city.name === 'Tešanj')
      // console.log('city: ', city)
      // if (!city) return res.status(500).json({ message: "Can't find Tešanj" })

      const countries: { data: { data: Country[] } } = await axios.get(
        OLX_API + '/countries'
      )

      if (!countries.data)
        return res.status(500).json({ message: 'Cannot GET /countries' })

      // Find BiH in countries response
      const country = countries?.data?.data?.find(
        (country) => country.code === 'BA'
      )

      if (!country) return res.status(500).json({ message: "Can't find BiH" })

      // Sugested categories by the OLX api
      const categories: { data: { data: Category[] } } = await axios.get(
        OLX_API + `/categories/suggest?keyword=${article.name}`
      )

      if (!categories.data)
        return res
          .status(500)
          .json({ message: 'Cannot GET /categories/suggest?keyword' })

      const category = categories.data.data[0]

      if (!category)
        return res
          .status(500)
          .json({ message: 'Cannot find suggested category' })

      // POST article to olx api
      // const response: { data: { error: string } } = await
      await axios
        .post(
          OLX_API + '/listings',
          {
            // data: {
            title: article?.name, // required and min 2 words
            listing_type: 'sell', // required
            category_id: category.id, // required
            short_description: article.description,
            description: article.description,
            country_id: country.id,
            city_id: 35,
            price: article.base_price,
            available: true,
            state: 'new',
            // },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.data.token}`,
            },
          }
        )
        .then(async (response: { data: { id: number } }) => {
          // Wright olx listing id to article olx_id field
          await prisma.article.update({
            where: { id: article.id },
            data: { olx_id: response.data.id },
          })
        })
        .catch(() => {
          // Handle errors here
          return res.status(500).json({ message: 'Article NOT posted to olx' })
        })

      res.status(200).json({ message: 'Article posted to olx' })
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    return res
      .status(400)
      .json({ message: `Cannot ${req.method || 'GET'} /olx/listing` })
  }
}
