import { z } from 'zod';
import { 
  insertProductSchema, 
  products,
  insertOrderSchema,
  insertReservationSchema,
  insertLocationSchema,
  orders,
  reservations,
  locations,
  loyaltyAccounts
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.string().optional(),
        spicyLevel: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        order: insertOrderSchema,
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          totalAmount: z.string(),
          status: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id',
      responses: {
        200: z.object({
          id: z.number(),
          status: z.string(),
          totalAmount: z.string(),
          items: z.array(z.object({
            productId: z.number(),
            quantity: z.number(),
            product: z.custom<typeof products.$inferSelect>(),
          })),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
  reservations: {
    create: {
      method: 'POST' as const,
      path: '/api/reservations',
      input: insertReservationSchema,
      responses: {
        201: z.custom<typeof reservations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  locations: {
    list: {
      method: 'GET' as const,
      path: '/api/locations',
      responses: {
        200: z.array(z.custom<typeof locations.$inferSelect>()),
      },
    },
  },
  loyalty: {
    get: {
      method: 'GET' as const,
      path: '/api/loyalty',
      responses: {
        200: z.custom<typeof loyaltyAccounts.$inferSelect>(),
        401: errorSchemas.notFound, // Use 401 for unauth
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
