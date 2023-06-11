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
        },
      })

      if (!images || !images.length)
        return res.status(404).json({ message: 'Images not found' })

      // for (let i = 0; i < images.length; i++) {
      //   const url = images[i]

      //   if (!url)
      //     return res
      //       .status(400)
      //       .json({ message: "Article images sin't assigned an access_url" })

      //   const upload = await axios.post(
      //     OLX_API + `/listings/${article.olx_id}/image-upload`,
      //     url.access_url,
      //     {
      //       headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${auth.data.token}`,
      //       },
      //     }
      //   )

      //   // @ts-ignore
      //   console.log('upload res: ', upload.data)
      // }

      // Create a new FormData object
      const formData = new FormData()

      // Append each image file to the FormData object
      images.forEach((file) => {
        if (!file.access_url) return
        formData.append(`url`, file.access_url)
      })

      const upload = await axios.post(
        OLX_API + `/listings/${article.olx_id}/image-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.data.token}`,
          },
        }
      )

      // @ts-ignore
      console.log('upload res: ', upload.data)

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

      res
        .status(200)
        .json({
          message: 'Images uploaded to olx',
          olx_message: publish.data as string,
        })
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    return res
      .status(400)
      .json({ message: `Cannot ${req.method || 'GET'} /olx/image` })
  }
}
