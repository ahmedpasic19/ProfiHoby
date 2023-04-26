import { createTRPCRouter, adminProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getAllUnEmployedUsers: adminProcedure.query(async ({ ctx }) => {
    const unemplyed_users = await ctx.prisma.user.findMany({
      where: { is_employed: false },
    })

    return unemplyed_users
  }),
})
