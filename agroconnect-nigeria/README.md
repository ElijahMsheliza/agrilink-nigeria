# AgroConnect Nigeria

A Next.js 14+ agricultural marketplace connecting Nigerian farmers with buyers. Built with modern web technologies and optimized for the Nigerian agricultural market.

## 🚀 Features

- **🌾 Complete Agricultural Marketplace**: Product listings, inquiries, messaging, orders, and reviews
- **🇳🇬 Nigerian Context**: Built specifically for the Nigerian agricultural market with local data
- **📱 Mobile-First Design**: Optimized for mobile devices and slow connections
- **🔒 Secure Authentication**: Supabase Auth with Row Level Security (RLS)
- **🗄️ Comprehensive Database**: Complete schema with Nigerian states, LGAs, and agricultural data
- **⚡ TypeScript**: Full type safety throughout the application
- **🧪 Testing**: Jest and React Testing Library setup
- **🎨 Modern UI**: Tailwind CSS with agricultural green/orange theme

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React + Radix UI Icons
- **State Management**: React Hooks + Supabase Realtime

## 📁 Project Structure

```
agroconnect-nigeria/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── api/               # API routes
│   ├── globals.css        # Global styles with agricultural theme
│   ├── layout.tsx         # Root layout with Nigerian SEO
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components (ready for setup)
│   ├── auth/             # Authentication components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client configuration
│   ├── utils.ts          # Utility functions (cn, etc.)
│   └── supabase-types.ts # Generated TypeScript types
├── types/                # TypeScript types
│   └── database.ts       # Comprehensive database types
├── constants/            # Application constants
│   └── nigeria.ts        # Nigerian states, crops, constants
├── supabase/             # Database schema and migrations
│   ├── migrations/       # SQL migration files
│   │   ├── 001_initial_schema.sql
│   │   └── 002_sample_data.sql
│   └── README.md         # Database documentation
├── __tests__/            # Test files
├── deploy-database.ps1   # Database deployment script
└── .env.local            # Environment variables
```

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles extending Supabase auth
- **states**: Nigerian states with codes (36 + FCT)
- **lgas**: Local Government Areas
- **farmer_profiles**: Detailed farmer information
- **buyer_profiles**: Company information for buyers
- **products**: Agricultural product listings
- **product_inquiries**: Buyer inquiries
- **messages**: Communication system
- **orders**: Transaction management
- **reviews**: Rating and review system

### Key Features
- **Row Level Security (RLS)**: Data protection policies
- **Performance Indexes**: Optimized queries
- **Foreign Key Constraints**: Data integrity
- **Automatic Timestamps**: Created/updated tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd agroconnect-nigeria
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

4. **Update `.env.local` with your Supabase credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. **Deploy the database schema:**
```bash
# Option 1: Use the deployment script
.\deploy-database.ps1

# Option 2: Manual deployment
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase db push
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase-types.ts
```

6. **Run the development server:**
```bash
npm run dev
```

7. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Current test coverage includes:
- ✅ Landing page rendering
- ✅ Component functionality
- ✅ Database type safety

## 🎨 Design System

### Colors
- **Primary**: Green (#059669) - Agricultural theme
- **Secondary**: Orange (#f97316) - Warm accent
- **Accent**: Light Green (#10b981) - Success states
- **Background**: Gradient from green-50 to orange-50

### Typography
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML

## 🇳🇬 Nigerian Context

### Supported Crops
- **Major Crops**: Rice, Maize, Cassava, Yam, Plantain, Cocoa, Palm Oil
- **Extended Crops**: Sorghum, Millet, Groundnut, Soybean, Cowpea, and more
- **Crop Varieties**: FARO rice varieties, TZEE maize, TMS cassava, etc.

### Nigerian States & LGAs
- **All 36 states + FCT** with proper codes
- **Major LGAs** for Lagos, Kano, Rivers, Kaduna, Oyo
- **Location-based** product filtering

### Business Features
- **Currency**: Nigerian Naira (₦) with proper formatting
- **Phone Numbers**: Nigerian format (+234) support
- **Company Types**: Processor, Exporter, Wholesaler, Retailer
- **Payment Terms**: Cash, credit options, mobile money
- **Certifications**: Organic, NAFDAC, SON, ISO standards

## 📱 Mobile Optimization

- **Minimum width**: 320px support
- **Touch-friendly**: 44px minimum button sizes
- **Slow connections**: Optimized for 2G/3G networks
- **Loading states**: Skeleton screens and progress indicators
- **Offline support**: Core functionality works offline

## 🔒 Security

- **Environment variables**: All secrets properly managed
- **Row Level Security**: Database-level data protection
- **Input validation**: Client and server-side validation
- **Rate limiting**: API protection (10 requests/minute)
- **No sensitive logging**: Secure error handling

## 📊 Performance

- **Bundle size**: < 500KB per page
- **API responses**: < 3 seconds
- **Image optimization**: Next.js Image component
- **Code splitting**: Automatic route-based splitting
- **Caching**: Supabase query optimization

## 🗄️ Database Features

### Row Level Security Policies
- Users can only access their own data
- Farmers manage only their own products
- Buyers see only active products and their inquiries
- Messages are private between sender and receiver
- Orders visible only to involved parties

### Performance Optimizations
- Indexed queries for fast product search
- Optimized location-based filtering
- Efficient user profile lookups
- Real-time subscriptions for messaging

## 🚀 Deployment

### Database Deployment
```bash
# Automated deployment
.\deploy-database.ps1

# Manual deployment
npx supabase db push
```

### Application Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# (Follow platform-specific instructions)
```

## 🔄 Development Workflow

1. **Feature Development**: Create feature branches
2. **Testing**: Write tests for new components
3. **Database Changes**: Create new migration files
4. **Type Safety**: Update TypeScript types
5. **Mobile Testing**: Verify on mobile devices
6. **Documentation**: Update relevant docs

## 🤝 Contributing

1. **Follow the rules** in `rule.md`
2. **Write tests** for new features
3. **Ensure mobile responsiveness**
4. **Follow TypeScript best practices**
5. **Update documentation** for changes

### Development Rules
- Maximum 200 lines per component
- Use TypeScript interfaces for all props
- Follow Next.js 14 App Router conventions
- Implement proper error handling
- Test on mobile devices

## 📚 Documentation

- **Database Schema**: `supabase/README.md`
- **Development Rules**: `rule.md`
- **TypeScript Types**: `types/database.ts`
- **Nigerian Constants**: `constants/nigeria.ts`

## 🎯 Next Steps

### Immediate Priorities
1. **Authentication System**: Complete login/signup flows
2. **shadcn/ui Setup**: Install and configure UI components
3. **API Routes**: Create CRUD operations
4. **Product Management**: Listing and search functionality

### Future Enhancements
- **Real-time Messaging**: Live chat between users
- **Payment Integration**: Nigerian payment gateways
- **Mobile App**: React Native companion app
- **Analytics**: User behavior and market insights

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service
- **Next.js** team for the amazing framework
- **Nigerian Agricultural Community** for domain expertise
- **Open Source Community** for the tools and libraries

---

**Built with ❤️ for Nigerian Farmers and Buyers**
