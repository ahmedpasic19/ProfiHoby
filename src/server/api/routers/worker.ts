import { z } from 'zod'

import { createTRPCRouter, adminProcedure } from '../trpc'

export const workerRouter = createTRPCRouter({
  addWorker: adminProcedure
    .input(z.object({ user_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const newWorker = await ctx.prisma.worker.create({
        data: { user_id: input.user_id },
      })

      // set user to be empolyed
      // this how we know which user is a worker and which isn't
      await ctx.prisma.user.update({
        where: { id: input.user_id },
        data: { is_employed: true },
      })

      return newWorker
    }),

  updateWorker: adminProcedure
    .input(z.object({ worker_id: z.string(), user_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const worker_user = await ctx.prisma.worker.findUnique({
        where: { id: input.worker_id },
      })

      const updatedWorker = await ctx.prisma.worker.update({
        where: { id: input.worker_id },
        data: { user_id: input.user_id },
      })

      // set previously employed user to be unempolyed
      // this how we know which user is a worker and which isn't
      await ctx.prisma.user.update({
        where: { id: worker_user?.user_id },
        data: { is_employed: false },
      })

      return updatedWorker
    }),

  deleteWorker: adminProcedure
    .input(z.object({ worker_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const worker_user = await ctx.prisma.worker.findUnique({
        where: { id: input.worker_id },
      })

      const deletedWorker = await ctx.prisma.worker.delete({
        where: { id: input.worker_id },
      })

      // set previously employed user to be unempolyed
      // this how we know which user is a worker and which isn't
      await ctx.prisma.user.update({
        where: { id: worker_user?.user_id },
        data: { is_employed: false },
      })

      return deletedWorker
    }),

  getAllWorkers: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.worker.findMany({ include: { user: true } })
  }),
})
