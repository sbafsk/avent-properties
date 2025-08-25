import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Create agencies
    console.log('Creating agencies...')
    const agency1 = await prisma.agency.create({
        data: {
            name: 'Luxury Estates Uruguay',
            email: 'info@luxuryestates.uy',
            phone: '+598 99 123 456',
            address: 'Ruta Interbalnearia Km 37, Punta del Este',
        },
    })

    const agency2 = await prisma.agency.create({
        data: {
            name: 'Coastal Properties José Ignacio',
            email: 'contact@coastalji.com',
            phone: '+598 99 789 012',
            address: 'Ruta 10 Km 180, José Ignacio',
        },
    })

    const agency3 = await prisma.agency.create({
        data: {
            name: 'Piriápolis Premium Real Estate',
            email: 'sales@piriapremium.com',
            phone: '+598 99 456 789',
            address: 'Rambla de los Argentinos 1234, Piriápolis',
        },
    })

    // Create properties
    console.log('Creating properties...')
    const properties = [
        {
            title: 'Oceanfront Villa Punta del Este',
            description: 'Stunning 5-bedroom villa with panoramic ocean views, private beach access, and infinity pool. This luxury property features high-end finishes, gourmet kitchen, and smart home technology.',
            price: 2500000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'La Barra',
            property_type: 'Villa',
            bedrooms: 5,
            bathrooms: 4,
            area_m2: 450,
            amenities: ['Pool', 'Beach Access', 'Garden', 'Security System', 'Wine Cellar', 'Smart Home'],
            images: ['/properties/villa-punta-1.jpg', '/properties/villa-punta-2.jpg', '/properties/villa-punta-3.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Modern Penthouse José Ignacio',
            description: 'Contemporary 3-bedroom penthouse with floor-to-ceiling windows, rooftop terrace, and designer interiors. Located in the heart of José Ignacio with easy access to restaurants and beaches.',
            price: 1800000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'Centro',
            property_type: 'Penthouse',
            bedrooms: 3,
            bathrooms: 3,
            area_m2: 280,
            amenities: ['Rooftop Terrace', 'Ocean View', 'Gourmet Kitchen', 'Gym', 'Concierge'],
            images: ['/properties/penthouse-ji-1.jpg', '/properties/penthouse-ji-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Beachfront Condo Piriápolis',
            description: 'Luxurious 2-bedroom beachfront condo with direct access to the sand, modern amenities, and spectacular sunset views. Perfect for investment or vacation home.',
            price: 850000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Playa Grande',
            property_type: 'Condo',
            bedrooms: 2,
            bathrooms: 2,
            area_m2: 120,
            amenities: ['Beach Access', 'Pool', 'Gym', 'Parking', 'Security'],
            images: ['/properties/condo-piri-1.jpg', '/properties/condo-piri-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Luxury Estate Punta del Este',
            description: 'Magnificent 8-bedroom estate on 2 hectares with private beach, tennis court, and helicopter pad. This is the ultimate luxury property for the discerning buyer.',
            price: 8500000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'Beverly Hills',
            property_type: 'Estate',
            bedrooms: 8,
            bathrooms: 8,
            area_m2: 1200,
            amenities: ['Private Beach', 'Tennis Court', 'Helipad', 'Wine Cellar', 'Staff Quarters', 'Security'],
            images: ['/properties/estate-punta-1.jpg', '/properties/estate-punta-2.jpg', '/properties/estate-punta-3.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Contemporary Villa José Ignacio',
            description: 'Architect-designed 4-bedroom villa with minimalist aesthetic, natural materials, and seamless indoor-outdoor living. Features a stunning infinity pool and ocean views.',
            price: 3200000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'La Juanita',
            property_type: 'Villa',
            bedrooms: 4,
            bathrooms: 4,
            area_m2: 380,
            amenities: ['Infinity Pool', 'Ocean View', 'Garden', 'Smart Home', 'Wine Cellar'],
            images: ['/properties/villa-ji-1.jpg', '/properties/villa-ji-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Mountain View Apartment Piriápolis',
            description: 'Spacious 3-bedroom apartment with panoramic mountain and ocean views. Located in a quiet residential area with easy access to the beach and city center.',
            price: 650000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Cerro San Antonio',
            property_type: 'Apartment',
            bedrooms: 3,
            bathrooms: 2,
            area_m2: 150,
            amenities: ['Mountain View', 'Balcony', 'Parking', 'Security', 'Garden'],
            images: ['/properties/apt-piri-1.jpg', '/properties/apt-piri-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Beach House Punta del Este',
            description: 'Charming 3-bedroom beach house with direct beach access, traditional architecture, and modern comforts. Perfect for families seeking a relaxed coastal lifestyle.',
            price: 1200000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'Playa Mansa',
            property_type: 'Beach House',
            bedrooms: 3,
            bathrooms: 2,
            area_m2: 200,
            amenities: ['Beach Access', 'Garden', 'BBQ Area', 'Parking', 'Security'],
            images: ['/properties/beachhouse-punta-1.jpg', '/properties/beachhouse-punta-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Luxury Loft José Ignacio',
            description: 'Sophisticated 2-bedroom loft with high ceilings, industrial design, and premium finishes. Located in a boutique building with exclusive amenities.',
            price: 1400000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'La Juanita',
            property_type: 'Loft',
            bedrooms: 2,
            bathrooms: 2,
            area_m2: 180,
            amenities: ['High Ceilings', 'Gourmet Kitchen', 'Gym', 'Concierge', 'Security'],
            images: ['/properties/loft-ji-1.jpg', '/properties/loft-ji-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Seaside Villa Piriápolis',
            description: 'Elegant 4-bedroom villa with stunning sea views, private pool, and landscaped gardens. Features traditional architecture with modern amenities.',
            price: 950000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Playa Verde',
            property_type: 'Villa',
            bedrooms: 4,
            bathrooms: 3,
            area_m2: 320,
            amenities: ['Sea View', 'Pool', 'Garden', 'BBQ Area', 'Parking'],
            images: ['/properties/villa-piri-1.jpg', '/properties/villa-piri-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Modern Townhouse Punta del Este',
            description: 'Contemporary 3-bedroom townhouse with rooftop terrace, garage, and smart home features. Located in a prestigious gated community.',
            price: 1600000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'San Rafael',
            property_type: 'Townhouse',
            bedrooms: 3,
            bathrooms: 3,
            area_m2: 250,
            amenities: ['Rooftop Terrace', 'Garage', 'Smart Home', 'Security', 'Garden'],
            images: ['/properties/townhouse-punta-1.jpg', '/properties/townhouse-punta-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Oceanfront Penthouse José Ignacio',
            description: 'Exclusive 4-bedroom penthouse with 360-degree ocean views, private elevator, and luxury finishes. The epitome of coastal luxury living.',
            price: 4200000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'La Juanita',
            property_type: 'Penthouse',
            bedrooms: 4,
            bathrooms: 4,
            area_m2: 400,
            amenities: ['360° Ocean View', 'Private Elevator', 'Rooftop Pool', 'Gourmet Kitchen', 'Concierge'],
            images: ['/properties/penthouse-ji-2-1.jpg', '/properties/penthouse-ji-2-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Coastal Apartment Piriápolis',
            description: 'Bright 2-bedroom apartment with ocean views, modern kitchen, and balcony. Perfect for investors or vacation rental.',
            price: 480000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Playa Grande',
            property_type: 'Apartment',
            bedrooms: 2,
            bathrooms: 2,
            area_m2: 90,
            amenities: ['Ocean View', 'Balcony', 'Modern Kitchen', 'Parking', 'Security'],
            images: ['/properties/apt-piri-2-1.jpg', '/properties/apt-piri-2-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Luxury Villa Punta del Este',
            description: 'Spectacular 6-bedroom villa with private beach access, infinity pool, and panoramic views. Features the finest materials and craftsmanship.',
            price: 5800000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'Beverly Hills',
            property_type: 'Villa',
            bedrooms: 6,
            bathrooms: 6,
            area_m2: 600,
            amenities: ['Private Beach', 'Infinity Pool', 'Panoramic Views', 'Wine Cellar', 'Staff Quarters'],
            images: ['/properties/villa-punta-2-1.jpg', '/properties/villa-punta-2-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Boutique Hotel José Ignacio',
            description: 'Charming 8-room boutique hotel with restaurant, spa, and ocean views. Perfect investment opportunity in a prime location.',
            price: 3500000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'Centro',
            property_type: 'Hotel',
            bedrooms: 8,
            bathrooms: 8,
            area_m2: 800,
            amenities: ['Restaurant', 'Spa', 'Ocean View', 'Garden', 'Parking'],
            images: ['/properties/hotel-ji-1.jpg', '/properties/hotel-ji-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Mountain Villa Piriápolis',
            description: 'Stunning 5-bedroom villa nestled in the mountains with panoramic views, private pool, and extensive gardens. Peaceful retreat with modern luxury.',
            price: 1200000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Cerro San Antonio',
            property_type: 'Villa',
            bedrooms: 5,
            bathrooms: 4,
            area_m2: 450,
            amenities: ['Mountain Views', 'Pool', 'Extensive Gardens', 'BBQ Area', 'Security'],
            images: ['/properties/villa-piri-2-1.jpg', '/properties/villa-piri-2-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Beachfront Condo Punta del Este',
            description: 'Luxurious 3-bedroom condo with direct beach access, modern amenities, and spectacular ocean views. Ideal for families or investors.',
            price: 1800000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'Playa Brava',
            property_type: 'Condo',
            bedrooms: 3,
            bathrooms: 3,
            area_m2: 180,
            amenities: ['Beach Access', 'Ocean View', 'Pool', 'Gym', 'Security'],
            images: ['/properties/condo-punta-1.jpg', '/properties/condo-punta-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Modern Villa José Ignacio',
            description: 'Contemporary 4-bedroom villa with clean lines, natural light, and seamless indoor-outdoor living. Features a stunning infinity pool and ocean views.',
            price: 2800000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'La Juanita',
            property_type: 'Villa',
            bedrooms: 4,
            bathrooms: 4,
            area_m2: 350,
            amenities: ['Infinity Pool', 'Ocean View', 'Modern Design', 'Smart Home', 'Garden'],
            images: ['/properties/villa-ji-2-1.jpg', '/properties/villa-ji-2-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
        {
            title: 'Seaside Apartment Piriápolis',
            description: 'Comfortable 2-bedroom apartment with sea views, balcony, and modern amenities. Perfect for vacation rental or permanent residence.',
            price: 520000,
            currency: 'USD',
            city: 'Piriápolis',
            neighborhood: 'Playa Verde',
            property_type: 'Apartment',
            bedrooms: 2,
            bathrooms: 2,
            area_m2: 100,
            amenities: ['Sea View', 'Balcony', 'Modern Amenities', 'Parking', 'Security'],
            images: ['/properties/apt-piri-3-1.jpg', '/properties/apt-piri-3-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency3.id,
        },
        {
            title: 'Luxury Penthouse Punta del Este',
            description: 'Exclusive 5-bedroom penthouse with panoramic views, private terrace, and luxury finishes. The ultimate in sophisticated urban living.',
            price: 4500000,
            currency: 'USD',
            city: 'Punta del Este',
            neighborhood: 'Puerto',
            property_type: 'Penthouse',
            bedrooms: 5,
            bathrooms: 5,
            area_m2: 500,
            amenities: ['Panoramic Views', 'Private Terrace', 'Luxury Finishes', 'Concierge', 'Security'],
            images: ['/properties/penthouse-punta-1.jpg', '/properties/penthouse-punta-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency1.id,
        },
        {
            title: 'Coastal Villa José Ignacio',
            description: 'Elegant 3-bedroom villa with direct beach access, private pool, and stunning ocean views. Perfect for those seeking privacy and luxury.',
            price: 2200000,
            currency: 'USD',
            city: 'José Ignacio',
            neighborhood: 'La Juanita',
            property_type: 'Villa',
            bedrooms: 3,
            bathrooms: 3,
            area_m2: 280,
            amenities: ['Beach Access', 'Private Pool', 'Ocean View', 'Garden', 'Security'],
            images: ['/properties/villa-ji-3-1.jpg', '/properties/villa-ji-3-2.jpg'],
            status: 'AVAILABLE',
            agency_id: agency2.id,
        },
    ]

    for (const property of properties) {
        await prisma.property.create({ data: property })
    }

    // Create sample users
    console.log('Creating sample users...')
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@aventproperties.com',
            name: 'Admin User',
            role: 'ADMIN',
        },
    })

    const clientUser = await prisma.user.create({
        data: {
            email: 'client@example.com',
            name: 'John Smith',
            role: 'CLIENT',
        },
    })

    const agencyUser = await prisma.user.create({
        data: {
            email: 'agency@luxuryestates.uy',
            name: 'Maria Rodriguez',
            role: 'AGENCY',
        },
    })

    // Create sample contact requests
    console.log('Creating sample contact requests...')
    const contactRequests = [
        {
            name: 'Ahmed Al Mansouri',
            email: 'ahmed@dubaiinvestments.com',
            phone: '+971 50 123 4567',
            message: 'Interested in the Oceanfront Villa Punta del Este. Please provide more details about the property and available viewing times.',
            status: 'NEW',
        },
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 555 123 4567',
            message: 'Looking for a luxury property in José Ignacio for investment purposes. Budget up to $3M USD.',
            status: 'IN_PROGRESS',
        },
        {
            name: 'Carlos Rodriguez',
            email: 'carlos@argentina.com',
            phone: '+54 11 4567 8901',
            message: 'Interested in the Modern Penthouse José Ignacio. Can you arrange a virtual tour?',
            status: 'RESOLVED',
        },
    ]

    for (const contact of contactRequests) {
        await prisma.contactRequest.create({ data: contact })
    }

    console.log('✅ Database seeded successfully!')
    console.log(`📊 Created:`)
    console.log(`   - ${properties.length} properties`)
    console.log(`   - 3 agencies`)
    console.log(`   - 3 sample users`)
    console.log(`   - ${contactRequests.length} contact requests`)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
