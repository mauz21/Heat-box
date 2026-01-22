<img width="703" height="1600" alt="image" src="https://github.com/user-attachments/assets/1cdc02fb-a054-4ed5-b359-c109b1c969c5" /># Heat Box - Gourmet Street Food in Islamabad

Heat Box is a premium full-stack restaurant application built for a modern dining experience in Islamabad. It features a bold, high-contrast design with a focus on "Savoring the Heat."

## 🚀 Features

### Core Functionality
- **Online Ordering**: Complete menu with categorization (Pizzas, Burgers, Wings), spicy level indicators, and a dynamic shopping cart.
- **Table Reservations**: Real-time booking system for dine-in experiences.
- **Order Tracking**: Visual status timeline from "Pending" to "Delivered."
- **Rewards Program**: Loyalty points system integrated with user accounts.
  <img width="864" height="1600" alt="image" src="https://github.com/user-attachments/assets/b05fc77e-7c64-4efc-83eb-1187d6f9d079" >
  <img width="1600" height="1500" alt="image" src="https://github.com/user-attachments/assets/6c527609-ec97-49f3-88f5-e97a7c4469bb" />
 <img width="821" height="1600" alt="image" src="https://github.com/user-attachments/assets/03af557c-9e9a-4ff2-bd95-65af8b28e4e0" />




### Content & Engagement
- **Secret Menu**: Exclusive items for VIP members.
- **Blog (Flavor Journey)**: Insights into the secret behind the signature Peri Peri sauce.
- **Festive Deals**: Seasonal bundles and limited-time offers.
- **Hygiene & Safety**: Dedicated section showcasing our 5-star commitment to cleanliness.
<img width="791" height="1600" alt="image" src="https://github.com/user-attachments/assets/9c02963e-8626-4749-97e3-9761c5765959" />
[Uploading image.png…]()


### User Experience
- **Authentication**: Secure login using Replit Auth (OIDC).
- **Locations**: Interactive map integration for all Islamabad branches.
- **Mobile Optimized**: Fully responsive design for on-the-go ordering.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Framer Motion.
- **Backend**: Express.js, Node.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Replit Auth.
- **Maps**: React-Leaflet / Leaflet.
- **State Management**: TanStack Query (React Query) & Zustand.

## 📂 Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks (Auth, Cart, etc.)
│   │   ├── pages/       # Page-level components
│   │   └── lib/         # Utility functions and API clients
├── server/              # Backend Express application
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database access layer
│   └── db.ts            # Database connection setup
├── shared/              # Code shared between frontend and backend
│   ├── schema.ts        # Drizzle database schema & Zod validation
│   └── routes.ts        # Shared API contract definitions
└── attached_assets/     # Original design assets and references
```

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure your PostgreSQL environment variables are set, then push the schema:
   ```bash
   npm run db:push
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

## 🔒 Environment Variables

The following secrets are required:
- `SESSION_SECRET`: For secure session management.
- `DATABASE_URL`: PostgreSQL connection string.

## 📄 License

© 2026 Heat Box Islamabad. All rights reserved.
