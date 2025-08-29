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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ElijahMsheliza/agrilink-nigeria.git
cd agrilink-nigeria
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
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

## 🇳🇬 Nigerian Context

### Supported Crops
- **Major Crops**: Rice, Maize, Cassava, Yam, Plantain, Cocoa, Palm Oil
- **Extended Crops**: Sorghum, Millet, Groundnut, Soybean, Cowpea, and more

### Nigerian States & LGAs
- **All 36 states + FCT** with proper codes
- **Major LGAs** for Lagos, Kano, Rivers, Kaduna, Oyo
- **Location-based** product filtering

## 📱 Mobile Optimization

- **Minimum width**: 320px support
- **Touch-friendly**: 44px minimum button sizes
- **Slow connections**: Optimized for 2G/3G networks
- **Loading states**: Skeleton screens and progress indicators

## 🔒 Security

- **Environment variables**: All secrets properly managed
- **Row Level Security**: Database-level data protection
- **Input validation**: Client and server-side validation
- **Rate limiting**: API protection (10 requests/minute)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service
- **Next.js** team for the amazing framework
- **Nigerian Agricultural Community** for domain expertise
- **Open Source Community** for the tools and libraries

---

**Built with ❤️ for Nigerian Farmers and Buyers**
