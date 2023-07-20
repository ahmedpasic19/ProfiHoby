import { z } from 'zod'

import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc'

export const orderRouter = createTRPCRouter({
  createOrder: publicProcedure
    .input(
      z.object({ token: z.string(), price: z.number(), address: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const newOrder = await ctx.prisma.order.create({
        data: {
          token: input.token,
          price: input.price,
          address: input.address,
        },
      })

      return newOrder
    }),

  updateOrder: publicProcedure
    .input(
      z.object({
        id: z.string(),
        price: z.number().nullish(),
        firstName: z.string(),
        lastName: z.string(),
        address: z.string(),
        phone_number: z.string().nullish(),
        note: z.string().nullish(),
        finished: z.boolean().nullish(),
        isLocked: z.boolean().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedOrder = await ctx.prisma.order.update({
        where: { id: input.id },
        data: {
          address: input.address,
          firstName: input.firstName,
          lastName: input.lastName,
          ...(input.phone_number ? { phone_number: input.phone_number } : {}),
          ...(input.note ? { note: input.note } : {}),
          ...(input.price ? { price: input.price } : {}),
          ...(input.finished !== null && input.finished !== undefined
            ? { finished: input.finished }
            : {}),
          ...(input.isLocked !== null && input.isLocked !== undefined
            ? { isLocked: input.isLocked }
            : {}),
        },
      })

      return updatedOrder
    }),

  deleteOrder: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // DELETE all orders articles
      await ctx.prisma.orderArticle.deleteMany({
        where: {
          order_id: input.id,
        },
      })

      const deletedOrder = await ctx.prisma.order.delete({
        where: { id: input.id },
      })

      return deletedOrder
    }),

  finishOrder: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const finishedOrder = await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          finished: true,
        },
      })

      return finishedOrder
    }),

  getMyOrders: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const myOrders = await ctx.prisma.order.findMany({
        where: {
          token: input.token,
        },
      })

      return myOrders
    }),

  getMyUnfinishedOrder: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const myOrder = await ctx.prisma.order.findFirst({
        where: {
          finished: false,
          isLocked: false,
          token: input.token,
        },
        include: {
          articles: { select: { article_id: true, totalPrice: true } },
        },
      })

      return myOrder
    }),

  getAllLockedOrders: adminProcedure
    .input(z.object({ finished: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const allOrders = await ctx.prisma.order.findMany({
        where: {
          isLocked: true,
          ...(input.finished ? { finished: true } : { finished: false }),
        },
      })

      return allOrders
    }),
})
