# AgroConnect Nigeria - Database Schema

This directory contains the Supabase database schema for the AgroConnect Nigeria agricultural marketplace.

## Overview

The database is designed to support a comprehensive agricultural marketplace connecting Nigerian farmers with buyers (processors, exporters, wholesalers, and retailers). The schema includes user management, product listings, inquiries, messaging, orders, and reviews.

## Database Tables

### Core Tables

1. **profiles** - Extends Supabase auth.users with additional user information
2. **states** - Nigerian states with codes
3. **lgas** - Local Government Areas linked to states
4. **farmer_profiles** - Detailed farmer information and farm details
5. **buyer_profiles** - Company information for buyers
6. **products** - Agricultural products listed by farmers
7. **product_inquiries** - Buyer inquiries about products
8. **messages** - Communication between farmers and buyers
9. **orders** - Completed transactions
10. **reviews** - User reviews and ratings

## Migration Files

### 001_initial_schema.sql
- Creates all database tables
- Sets up indexes for performance
- Enables Row Level Security (RLS)
- Creates RLS policies for data protection
- Sets up triggers for automatic timestamp updates

### 002_sample_data.sql
- Inserts all 36 Nigerian states + FCT
- Inserts LGAs for major states (Lagos, Kano, Rivers, Kaduna, Oyo)
- Contains commented examples of user profile creation

## Key Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Farmers can only manage their own products
- Buyers can only see active products and their own inquiries
- Messages are only visible to sender and receiver
- Orders are only visible to involved parties

### Performance Indexes
- Product search by crop type and location
- Active products filtering
- Order status tracking
- User profile lookups

### Data Integrity
- Foreign key constraints ensure referential integrity
- CHECK constraints validate data formats
- Unique constraints prevent duplicates
- Automatic timestamp updates

## Setup Instructions

### 1. Supabase Project Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_ID
```

### 2. Run Migrations
```bash
# Apply the initial schema
supabase db push

# Or run migrations individually
supabase db reset
```

### 3. Generate TypeScript Types
```bash
# Generate types from your database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase-types.ts
```

### 4. Environment Variables
Ensure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Data Flow

### User Registration
1. User signs up through Supabase Auth
2. Profile record is created in `profiles` table
3. User completes either `farmer_profiles` or `buyer_profiles`

### Product Listing
1. Farmer creates product in `products` table
2. Product is visible to all buyers (if active)
3. Buyers can create inquiries about products

### Transaction Process
1. Buyer creates inquiry in `product_inquiries`
2. Farmer and buyer communicate via `messages`
3. When agreement is reached, order is created in `orders`
4. After completion, users can leave reviews

## API Usage Examples

### Get User Profile
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Get Active Products
```typescript
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    farmer:farmer_profiles(*),
    location_state:states(*),
    location_lga:lgas(*)
  `)
  .eq('is_active', true)
```

### Create Product Inquiry
```typescript
const { data: inquiry } = await supabase
  .from('product_inquiries')
  .insert({
    product_id: 'product-uuid',
    buyer_id: 'buyer-uuid',
    quantity_requested: 10,
    proposed_price_per_unit: 500,
    message: 'Interested in your rice'
  })
  .select()
  .single()
```

## Data Validation

### Crop Types
Must be from the approved list in `constants/nigeria.ts`:
- Rice, Maize, Cassava, Yam, Plantain, Cocoa, Palm Oil, etc.

### Quality Grades
- premium, grade_a, grade_b, grade_c

### Units
- bags, tonnes, kilograms

### Company Types
- processor, exporter, wholesaler, retailer

## Security Considerations

1. **RLS Policies**: All data access is controlled by RLS policies
2. **Input Validation**: Use TypeScript types and database constraints
3. **Authentication**: All operations require valid Supabase auth session
4. **Data Sanitization**: Validate all user inputs before database operations

## Monitoring and Maintenance

### Database Health Checks
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM farmer_profiles fp 
LEFT JOIN profiles p ON fp.user_id = p.id 
WHERE p.id IS NULL;

-- Check for expired inquiries
SELECT COUNT(*) FROM product_inquiries 
WHERE response_deadline < NOW() AND status = 'pending';
```

### Performance Monitoring
- Monitor query performance using Supabase dashboard
- Check index usage and create additional indexes as needed
- Monitor RLS policy performance

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure user is authenticated and policies are correctly configured
2. **Foreign Key Violations**: Check that referenced records exist before creating relationships
3. **Type Mismatches**: Ensure TypeScript types match database schema exactly

### Debug Queries
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check table structure
\d+ public.profiles
```

## Contributing

When making schema changes:
1. Create new migration files with descriptive names
2. Update TypeScript types in `types/database.ts`
3. Update constants in `constants/nigeria.ts` if needed
4. Test migrations on development database first
5. Update this README with any new features

## Support

For database-related issues:
1. Check Supabase documentation
2. Review RLS policies and permissions
3. Verify environment variables are correct
4. Check migration logs in Supabase dashboard
