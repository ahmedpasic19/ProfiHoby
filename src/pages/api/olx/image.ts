import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

import { env } from '../../../env/server.mjs'

const prisma = new PrismaClient()

const OLX_API = env.OLX_API
const USERNAME = env.OLX_USERNAME
const PASSWORD = env.OLX_PASSWORD

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

      // GET article olx_id
      const article = await prisma.article.findUnique({
        where: { id: typeof req.query.id === 'string' ? req.query.id : '' },
        select: { id: true, olx_id: true },
      })

      if (!article)
        return res.status(404).json({ message: 'Article not found' })

      if (!article?.olx_id)
        return res
          .status(404)
          .json({ message: "Article isn't assigned a listing id" })

      // GET S3 access_url from article images
      const images = await prisma.image.findMany({
        where: {
          article_id: article.id,
        },
        select: {
          access_url: true,
          key: true,
        },
      })

      if (!images || !images.length)
        return res.status(404).json({ message: 'Images not found' })

      // POST all images to OLX
      for (let i = 0; i < images.length; i++) {
        if (!images[i]?.access_url || !images[i]?.key)
          return console.log('No file image')

        const image = await fetch(images[i]?.access_url || '')

        const imageBlob = await image.blob()

        const formData = new FormData()

        formData.append('images[]', imageBlob, images[i]?.key)

        fetch(OLX_API + `/listings/${article.olx_id}/image-upload`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.data.token}`,
          },
        })
          .then((response) => response.text())
          .then((data) => {
            console.log('UPLOAD RESPONSE: ', data)
            // Process the response data here
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }

      // When listing is added to olx api its in a "draft" state
      // It needs to be published for listing upload to be finished
      const publish = await axios.post(
        OLX_API + `/listings/${article.olx_id}/publish`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.data.token}`,
          },
        }
      )

      res.status(200).json({
        message: 'Images uploaded to olx',
        olx_message: publish.data as string,
      })
    } catch (error) {
      res.status(500).json(error)
      console.log(error)
    }
  } else {
    return res
      .status(400)
      .json({ message: `Cannot ${req.method || 'GET'} /olx/image` })
  }
}
