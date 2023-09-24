import z from 'zod';

const apiErrorScheme = z.object({
  status: z.number(),
  data: z.object({
    message: z.string()
  })
});

type ApiError = z.infer<typeof apiErrorScheme>;

export const isApiError = (object: unknown): object is ApiError => {
  return apiErrorScheme.safeParse(object).success;
};
