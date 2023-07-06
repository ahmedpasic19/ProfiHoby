import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

import { env } from '../../../env/server.mjs'
import { parseTextFormat } from '../../../utils/formatText'

const prisma = new PrismaClient()

const OLX_API = env.OLX_API
const USERNAME = env.OLX_USERNAME
const PASSWORD = env.OLX_PASSWORD

type Country = { id: number; name: string; code: string }

type Category = {
  id: number
  count: 1148
  name: string
  parent_categories: string[]
}

function containsNonLatinChars(str: string) {
  const latinRegex = /^[a-zA-Z0-9\sčšćžđ+,\.\-'/]+$/
  return !latinRegex.test(str)
}

function checkFor2Words(title: string) {
  const words = title.split(' ')
  if (words.length < 2) return false
  else return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (!req.query.id)
        return res.status(400).json({ message: 'Article ID required' })

      const article = await prisma.article.findUnique({
        where: { id: req.query.id as string },
        include: {
          groups: {
            include: {
              group: {
                select: {
                  olx_category_id: true,
                },
              },
            },
          },
        },
      })

      // GET auth token
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

      if (
        article?.name === 'Villager hidropak hidrofor VGP 800' ||
        article?.name === 'Einhell kofer za alat E-Box L70/35' ||
        article?.name === 'Villager kompresor za vazduh VAT 24 L' ||
        article?.name === 'Villager kompresor za vazduh VAT 50 L' ||
        article?.name === 'Vrtni električni trimer 2u1 550 W VERTO 52G552' ||
        article?.name === 'Villager hidropak hidrofor VGP 800'
      )
        return

      if (containsNonLatinChars(article?.name || '')) {
        // Skip non-Latin strings
        return res.status(400).json({ message: 'Non latin character!!! ' })
      }
      // Check if title has 2 words
      if (!checkFor2Words(article?.name || '')) {
        // Skip non-Latin strings
        return res.status(400).json({ message: '2 words needed!!!' })
      }

      /////////////////////
      // GET new article
      if (!article)
        return res.status(404).json({ message: 'Article not found' })

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

      const uri = encodeURI(
        OLX_API +
          `/categories/suggest?keyword=${article.name.replace(/\s/g, '%')}`
      )

      // Sugested categories by the OLX api
      const categories: { data: { data: Category[] } } = await axios.get(uri)

      if (!categories.data)
        return res
          .status(500)
          .json({ message: 'Cannot GET /categories/suggest?keyword' })

      const category_id = article.groups[0]?.group.olx_category_id

      if (!category_id)
        return res.status(404).json({ message: 'No group category' })

      // const backup_category_id = 1578
      console.log('category: ', category_id)
      const attributes: { data: { data: object[] } } = await axios.get(
        OLX_API + `/categories/${category_id}/attributes`
      )

      console.log('attributes:', attributes.data.data)

      // POST article to olx api
      // const response: { data: { error: string } } = await
      await axios
        .post(
          OLX_API + '/listings',
          {
            title: article?.name.substring(0, 54), // required and min 2 words
            listing_type: 'sell', // required
            category_id: category_id, // required
            short_description: `${
              article.warranty ? `Garancija: ${article.warranty}\n` : ''
            }${parseTextFormat(
              article.description
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
            )}`.substring(0, 244),
            description: `${
              article.warranty ? `Garancija: ${article.warranty}\n` : ''
            }${parseTextFormat(
              article.description
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
            )}`.substring(0, 244),
            country_id: country.id,
            city_id: 35,
            price: article.base_price,
            available: false,
            state: 'new',
            ...(attributes?.data.data.length ? { attributes: [] } : {}),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.data.token}`,
            },
          }
        )
        .then(async (response: { data: { id: number } }) => {
          console.log('OLX ID RESPONSE: ', response.data)

          // Wright olx listing id to article olx_id field
          await prisma.article.update({
            where: { id: article.id },
            data: { olx_id: response.data.id },
          })
        })
      ////////////////////////

      ///////////////////////////

      // GET article olx_id
      const article1 = await prisma.article.findUnique({
        where: { id: article?.id },
        select: { id: true, olx_id: true },
      })

      if (!article1)
        return res.status(404).json({ message: 'Article not found' })

      if (!article1?.olx_id) {
        console.log("Article isn't assigned a listing id.... CONTINUE")
        return
      }

      // GET S3 access_url from article1 images
      const images = await prisma.image.findMany({
        where: {
          article_id: article1.id,
        },
        select: {
          access_url: true,
          key: true,
        },
      })

      if (!images || !images.length) {
        console.log('IMAGES NOT FOUND... CONTINUTING')
        return
      }

      // POST all images to OLX
      for (let i = 0; i < images.length; i++) {
        if (!images[i]?.access_url || !images[i]?.key)
          return console.log('No file image')

        const image = await fetch(images[i]?.access_url || '')

        const imageBlob = await image.blob()

        const formData = new FormData()

        formData.append('images[]', imageBlob, images[i]?.key)
        console.log('IMAGE UPLOAD FORMDATA: ', formData)

        fetch(OLX_API + `/listings/${article1.olx_id}/image-upload`, {
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
      await axios.post(
        OLX_API + `/listings/${article1.olx_id}/publish`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.data.token}`,
          },
        }
      )

      ////////////////////

      return res.status(200).json({ message: 'Syncing completed.' })
    } catch (error) {
      console.log('eeror 2')
      // console.log(Object.keys(error.response.data.error || {}))
      // console.log(error.response.data.error)
      res.status(500).json(error)
    }
  } else if (req.method === 'PUT') {
    try {
      if (!req.query?.id)
        return res.status(400).json({ message: 'Article ID required' })

      const article = await prisma.article.findUnique({
        where: { id: req.query.id as string },
        include: {
          groups: {
            include: {
              group: {
                select: {
                  olx_category_id: true,
                },
              },
            },
          },
        },
      })

      if (!article || !article.olx_id)
        return res.status(404).json({ message: 'Article was not found' })

      // GET auth token
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

      const updatedListing = await axios.put(
        OLX_API + `/listings/${article.olx_id}`,
        {
          title: article?.name.substring(0, 54), // required and min 2 words
          // short_description: `${
          //   article.warranty ? `Garancija: ${article.warranty}\n` : ''
          // }${parseTextFormat(
          //   article.description
          //     .replace(/&lt;/g, '<')
          //     .replace(/&gt;/g, '>')
          //     .replace(/&amp;/g, '&')
          //     .replace(/&quot;/g, '"')
          //     .replace(/&#39;/g, "'")
          // )}`.substring(0, 244),
          description: `${
            article.warranty ? `Garancija: ${article.warranty}\n` : ''
          }${parseTextFormat(
            article.description
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
          )}`.substring(0, 244),
          price: article.base_price,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.data.token}`,
          },
        }
      )

      res.status(200).json(updatedListing.data)
    } catch (error) {
      return res.status(500).json(error)
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!req.query?.id)
        return res.status(400).json({ message: 'Article ID required' })

      // GET auth token
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

      const deletedListing = await axios.delete(
        OLX_API + `/listings/${req.query.id as string}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.data.token}`,
          },
        }
      )

      res.status(200).json(deletedListing.data)
    } catch (error) {
      return res.status(500).json(error)
    }
  } else {
    return res
      .status(400)
      .json({ message: `Cannot ${req.method || 'GET'} /olx/listing` })
  }
}
