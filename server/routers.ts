import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { saveCommunityMember, saveContactMessage, saveEventRegistration, saveNewsletterSubscriber } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  community: router({
    join: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), city: z.string().min(2), interests: z.array(z.string()).default([]) })).mutation(async ({ input }) => {
      await saveCommunityMember({ ...input, interests: input.interests.join(", ") });
      return { success: true } as const;
    }),
    newsletter: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
      await saveNewsletterSubscriber(input.email);
      return { success: true } as const;
    }),
    event: publicProcedure.input(z.object({ eventName: z.string().min(2), eventDate: z.string().min(2), name: z.string().min(2), email: z.string().email() })).mutation(async ({ input }) => {
      await saveEventRegistration(input);
      return { success: true } as const;
    }),
    contact: publicProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), subject: z.string().min(2), message: z.string().min(3) })).mutation(async ({ input }) => {
      await saveContactMessage(input);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
