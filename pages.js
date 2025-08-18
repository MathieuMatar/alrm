import express from 'express';
import { Accomodation, Venue, Room, Other, Map } from './models.js';
import { buildTree } from './img.js';

const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const venues = await Venue.findAll();
        const accomodations = await Accomodation.findAll();

        // Replace string features with parsed array in each accomodation
        accomodations.forEach(acc => {
            if (typeof acc.features === 'string') {
            try {
                acc.features = JSON.parse(acc.features);
            } catch (e) {
                acc.features = [];
            }
            }
        });

        

        const activities = await Other.findAll({ where: { type: 'activities' } });
        const nightlife = await Other.findAll({ where: { type: 'nightlife' } });
        const occasions = await Other.findAll({ where: { type: 'occasions' } });
        const home = await Other.findOne({ where: { type: 'intro', code: 'home' } });
        const mapData = await Map.findAll();



        const seo = {
            "meta": {
                "charset": "UTF-8",
                "viewport": "width=device-width, initial-scale=1",
                "viewTransition": "same-origin",
                "description": "Escape to Alyasa Village - a luxury Lebanese retreat nestled in stunning landscapes. Experience authentic Lebanese culture with modern comforts, luxurious accommodations, traditional cuisine, spa services, and breathtaking event venues in Saqi Rechmaiya, Jbeil.",
                "keywords": "Alyasa Village, Lebanese retreat, luxury accommodation Lebanon, wedding venue Lebanon, Jbeil hotels, Lebanese culture, spa Lebanon, event venues, mountain retreat, Lebanese hospitality, luxury villas Lebanon",
                "author": "Alyasa Village",
                "robots": "index, follow"
            },
            "title": "Alyasa Village - Luxury Lebanese Retreat & Event Venue | Jbeil, Lebanon",
            "canonical": "https://www.alyasavillage.com/",
            "openGraph": {
                "title": "Alyasa Village - Luxury Lebanese Retreat & Event Venue",
                "description": "Discover Alyasa Village, where authentic Lebanese charm meets modern luxury. Escape to our serene mountain retreat featuring luxury villas, world-class venues, and unforgettable experiences in Jbeil, Lebanon.",
                "image": "https://www.alyasavillage.com/img/home-banners/1.jpg",
                "url": "https://www.alyasavillage.com/",
                "type": "website",
                "site_name": "Alyasa Village"
            },
            "twitter": {
                "card": "summary_large_image",
                "title": "Alyasa Village - Luxury Lebanese Retreat & Event Venue",
                "description": "Experience authentic Lebanese hospitality at Alyasa Village. Luxury accommodations, stunning venues, and cultural immersion in Jbeil's breathtaking landscapes.",
                "image": "https://www.alyasavillage.com/img/home-banners/1.jpg"
            },
            "favicon": "/favicon.ico",
            "fonts": [
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com"
            ],
            "googleFontLink": "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
            "stylesheet": "/css/home.css",
            "structuredData": {
                "@context": "https://schema.org",
                "@type": "LodgingBusiness",
                "name": "Alyasa Village",
                "url": "https://www.alyasavillage.com/",
                "description": "Luxury Lebanese retreat offering authentic cultural experiences, premium accommodations, event venues, and wellness facilities in the stunning landscapes of Jbeil, Lebanon.",
                "image": [
                    "https://www.alyasavillage.com/img/home-banners/1.jpg",
                    "https://www.alyasavillage.com/img/home-banners/2.jpg",
                    "https://www.alyasavillage.com/img/home-banners/3.jpg",
                    "https://www.alyasavillage.com/img/home-banners/4.jpg"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Saqi Rechmaiya",
                    "addressLocality": "Jbeil",
                    "addressCountry": "Lebanon"
                },
                "telephone": "+961 71 71 58 71",
                "email": "hello@alyasavillage.com",
                "priceRange": "$$$$",
                "amenityFeature": [
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Swimming Pool"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Gym"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Sauna"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Steam Room"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Spa Services"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Event Venues"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Restaurant"
                    },
                    {
                        "@type": "LocationFeatureSpecification",
                        "name": "Bar"
                    }
                ],
                "sameAs": [
                    "https://www.facebook.com/alyasavillage",
                    "https://www.instagram.com/alyasavillage",
                    "https://www.youtube.com/channel/UC95fmJSUmd5U6zX8uf72QBg",
                    "https://www.linkedin.com/company/alyasavillage/"
                ],
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "34.1208",
                    "longitude": "35.6482"
                },
                "hasMap": "https://maps.app.goo.gl/3CZ36SiP7vrUv8Mm6"
            }
        }


        //get the html from the page https://www.alyasavillage.com/review-api/
        const response = await fetch('https://www.alyasavillage.com/review-api/');
        const review = await response.text();

        res.status(200).render('index', { venues, accomodations, activities, nightlife, occasions, home, seo, mapData, review });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/accommodations', async (req, res) => {
    const accomodations = await Accomodation.findAll();
    const rooms2 = await Room.findAll({
        include: {
            model: Accomodation,
            attributes: ['id', 'code'],
        },
        raw: true,
    });
    const rooms = rooms2.map(r => ({
        id: r.id,
        name: r.name,
        code: r.code,
        description: r.description,
        features: r.features,
        accomodationId: r.accomodationId,
        accomodationCode: r['Accomodation.code'],
    }));
    const intro = await Other.findOne({ where: { type: 'intro', code: 'accomodations' } });
    res.status(200).render('accomodations', { accomodations, rooms, intro });


});

router.get('/accommodations/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const accomodations = await Accomodation.findAll();
        const accomodation = await Accomodation.findOne({ where: { code } });
        if (!accomodation) {
            return res.status(404).send('Accomodation not found');
        }
        const rooms2 = await Room.findAll({
            include: {
                model: Accomodation,
                attributes: ['id', 'code'],
            },
            raw: true,
        });

        const rooms = rooms2.map(r => ({
            id: r.id,
            name: r.name,
            code: r.code,
            description: r.description,
            features: r.features,
            accomodationId: r.accomodationId,
            accomodationCode: r['Accomodation.code'],
        }));

        const intro = await Other.findOne({ where: { type: 'intro', code: 'accomodations' } });
        res.status(200).render('accomodations', { accomodations, rooms, intro });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/accommodations/:code/:roomcode', async (req, res) => {
    try {
        const { code, roomcode } = req.params;
        const accomodation = await Accomodation.findOne({ where: { code } });
        if (!accomodation) {
            return res.status(404).send('Accomodation not found');
        }
        const room = await Room.findOne({ where: { code: roomcode } });
        if (!room) {
            return res.status(404).send('Room not found');
        }
        // Parse features as JSON arrays if they are strings
        if (typeof room.features === 'string') {
            try {
                room.features = JSON.parse(room.features);
            } catch (e) {
                room.features = [];
            }
        }

        //find map where name is equal to accomodation.name
        const maps = await Map.findOne({ where: { name: accomodation.name }, raw: true });
        res.status(200).render('room', { room, code, maps });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

const venues = await Venue.findAll();
for (const venue of venues) {

    // Parse features and events as JSON arrays if they are strings
    if (typeof venue.features === 'string') {
        try {
            venue.features = JSON.parse(venue.features);
        } catch (e) {
            venue.features = [];
        }
    }
    if (typeof venue.events === 'string') {
        try {
            venue.events = JSON.parse(venue.events);
        } catch (e) {
            venue.events = [];
        }
    }


    router.get(`/${venue.code}`, async (req, res) => {
        //get maps where name is equal to venue name
        const maps = await Map.findOne({ where: { name: venue.name }, raw: true });
        res.status(200).render('venue', { venue, venues, maps });
    });
}

router.get('/s', (req, res) => res.status(200).render('single'));

router.get('/map', async (req, res) => {
    const mapData = await Map.findAll();
    res.status(200).render('partials/map', { mapData });
});

function getAllPaths(data) {
    const paths = [];

    const traverse = (obj) => {
        Object.values(obj).forEach(value => {
            if (value && typeof value === 'object') {
                if (value.path) {
                    paths.push(value.img);
                } else {
                    traverse(value);
                }
            }
        });
    };

    traverse(data);
    return paths;
}


//const gallery = buildTree();

//console.log('Gallery structure:', gallery);

//const flatGallery = getAllPaths(gallery);

router.get('/gallery', async (req, res) => {
    res.status(200).render('gallery', { gallery: flatGallery });
});

router.get('/activities', async (req, res) => {
    res.status(200).render('activities');
});

router.get('/blog', async (req, res) => {
    res.status(200).render('blog');
});

export default router;
