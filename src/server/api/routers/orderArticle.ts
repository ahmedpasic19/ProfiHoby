import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const orderArticleRouter = createTRPCRouter({
  createOrderAndOrderArticle: publicProcedure
    .input(
      z.object({
        token: z.string(),
        amount: z.number(),
        price: z.number(),
        article_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if a user has an existing unfinished order
      const foundOrder = await ctx.prisma.order.findFirst({
        where: {
          token: input.token,
          finished: false,
          isLocked: false,
        },
        select: {
          price: true,
          id: true,
        },
      })

      // If user has no unfinished order
      // Create new order to add article to
      if (!foundOrder) {
        const newOrder = await ctx.prisma.order.create({
          data: {
            token: input.token,
            address: '',
            price: input.amount * input.price,
          },
        })

        await ctx.prisma.orderArticle.create({
          data: {
            order_id: newOrder.id,
            article_id: input.article_id,
            amount: input.amount,
            price: input.price,
            totalPrice: input.amount * input.price,
          },
        })

        return newOrder
      } else {
        // If user has an unfinished order
        // Add article to that order
        await ctx.prisma.orderArticle.create({
          data: {
            order_id: foundOrder.id,
            article_id: input.article_id,
            amount: input.amount,
            price: input.price,
            totalPrice: input.amount * input.price,
          },
        })

        // Update order total
        await ctx.prisma.order.update({
          where: { id: foundOrder.id },
          data: {
            price: foundOrder.price + input.amount * input.price,
          },
        })

        return foundOrder
      }
    }),

  createOrderArticle: publicProcedure
    .input(
      z.object({
        order_id: z.string(),
        amount: z.number(),
        price: z.number(),
        totalPrice: z.number(),
        article_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newOrderArticle = await ctx.prisma.orderArticle.create({
        data: {
          order_id: input.order_id,
          article_id: input.article_id,
          amount: input.amount,
          price: input.price,
          totalPrice: input.totalPrice,
        },
      })

      return newOrderArticle
    }),

  updateOrderArticle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number(),
        price: z.number(),
        totalPrice: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedOrder = await ctx.prisma.orderArticle.update({
        where: { id: input.id },
        data: {
          amount: input.amount,
          price: input.price,
          totalPrice: input.totalPrice,
        },
      })

      return updatedOrder
    }),

  deleteOrderArticle: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedOrder = await ctx.prisma.orderArticle.delete({
        where: { id: input.id },
      })

      return updatedOrder
    }),

  getAllOrderArticles: publicProcedure
    .input(z.object({ order_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const orderArticles = await ctx.prisma.orderArticle.findMany({
        where: {
          order_id: input.order_id,
        },
        include: {
          article: {
            include: {
              image: {
                select: {
                  access_url: true,
                },
                take: 1,
              },
            },
          },
        },
      })

      return orderArticles
    }),
})
