import { PrismaClient } from '@prisma/client';
import amenityData from '../src/data/amenities.json' assert { type: 'json' };
import bookingData from '../src/data/bookings.json' assert { type: 'json' };
import hostData from '../src/data/hosts.json' assert { type: 'json' };
import propertyData from '../src/data/properties.json' assert { type: 'json' };
import reviewData from '../src/data/reviews.json' assert { type: 'json' };
import userData from '../src/data/users.json' assert { type: 'json' };

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
    const { amenities } = amenityData;
    const { bookings } = bookingData;
    const { hosts } = hostData;
    const { properties } = propertyData;
    const { reviews } = reviewData;
    const { users } = userData;

    // Upsert Amenities
    for (const amenity of amenities) {
        await prisma.amenity.upsert({
            where: { id: amenity.id },
            update: {},
            create: amenity,
        });
    }

    // Upsert Hosts
    for (const host of hosts) {
        await prisma.host.upsert({
            where: { id: host.id },
            update: {},
            create: host,
        });
    }

    // Upsert Users
    for (const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                username: user.username,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture
            },
        });
    }

    // Upsert Properties
    for (const property of properties) {
        await prisma.property.upsert({
            where: { id: property.id },
            update: {},
            create: {
                id: property.id,
                name: property.name,
                location: property.location,
                price: property.price,
                hostId: property.hostId,
                title: property.title,
                description: property.description,
                pricePerNight: property.pricePerNight,
                bedroomCount: property.bedroomCount,
                bathRoomCount: property.bathRoomCount,
                maxGuestCount: property.maxGuestCount,
                rating: property.rating
            },
        });
    }

    // Upsert Bookings
    for (const booking of bookings) {
        if (!users.some(user => user.id === booking.userId)) {
            console.error(`User with id ${booking.userId} not found!`);
            continue; // Skip this booking if the user doesn't exist
        }

        if (!hosts.some(host => host.id === booking.hostId)) {
            console.error(`Host with id ${booking.hostId} not found!`);
            continue; // Skip this booking if the host doesn't exist
        }

        await prisma.booking.upsert({
            where: { id: booking.id },
            update: {},
            create: {
                id: booking.id,
                title: booking.title,
                userId: booking.userId,
                propertyId: booking.propertyId,
                checkinDate: new Date(booking.checkinDate),
                checkoutDate: new Date(booking.checkoutDate),
                numberOfGuests: booking.numberOfGuests,
                totalPrice: booking.totalPrice,
                bookingStatus: booking.bookingStatus,
                hostId: booking.hostId,
            },
        });
    }

    // Upsert Reviews
    for (const review of reviews) {
        await prisma.review.upsert({
            where: { id: review.id },
            update: {},
            create: {
                id: review.id,
                userId: review.userId,
                propertyId: review.propertyId,
                rating: review.rating,
                comment: review.comment,
            },
        });
    }
}

main()
    .then(() => {
        console.log('Data seeded successfully!');
        prisma.$disconnect();
    })
    .catch((error) => {
        console.error('Error seeding data:', error);
        prisma.$disconnect();
        process.exit(1);
    });
