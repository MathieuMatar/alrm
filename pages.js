import express from 'express';
import { Accomodation, Venue, Room, Other, Map, Page } from './models.js';
import nodemailer from 'nodemailer';
import { name, render } from 'ejs';

const router = express.Router();

router.get('/t', (req, res) => {
    res.render('test');
});

router.get('/', async (req, res) => {

    const baseUrl = req.protocol + '://' + req.get('host');

    const [venues, accomodations, activities, nightlife, occasions, home, mapData, review, meta] = await Promise.all([
        Venue.findAll(),
        Accomodation.findAll(),
        Other.findAll({ where: { type: 'activities' } }),
        Other.findAll({ where: { type: 'nightlife' } }),
        Other.findAll({ where: { type: 'occasions' } }),
        Other.findOne({ where: { type: 'intro', code: 'home' } }),
        Map.findAll(),
        fetch('https://www.alyasavillage.com/review-api/').then(res => res.text()),
        Page.findOne({ where: { type: 'seo', slug: 'home' }, raw: true })
    ]);
    accomodations.forEach(acc => acc.features = JSON.parse(acc.features));

    const seo = getSeo(meta, req, "/css/home.css");

    res.status(200).render('index', { venues, accomodations, activities, nightlife, occasions, home, seo, mapData, review });
});

router.get('/accommodations/:code?', async (req, res) => {
    const { code } = req.params;
    const [accomodations, rooms, intro, meta] = await Promise.all([
        Accomodation.findAll(),
        Room.findAll({
            include: {
                model: Accomodation,
                attributes: ['id', 'code'],
            }
        }),
        Other.findOne({ where: { type: 'intro', code: 'accomodations' } }),
        Page.findOne({ where: { type: 'seo', slug: 'accommodations' }, raw: true })
    ]);
    if (code && !accomodations.find(a => a.code === code)) {
        return res.redirect('/');
    }

    const seo = getSeo(meta, req, "/css/accomodations.css");

    res.status(200).render('accomodations', { accomodations, rooms, intro, seo });
});


router.get('/accommodations/:code/:roomcode', async (req, res) => {
    const { code, roomcode } = req.params;
    const [room, meta] = await Promise.all([
        Room.findOne({
            where: { code: roomcode },
            include: {
                model: Accomodation,
                attributes: ['code', 'name'],
            }
        }),
        Page.findOne({ where: { type: 'seo', slug: 'room' }, raw: true })
    ]);




    if (!room || room.Accomodation.code !== code) {
        return res.redirect('/');
    }
    room.features = JSON.parse(room.features);

    meta.title = room.name;
    meta.thumbnail = `/img/rooms/${room.code}/1.avif`;
    meta.html = '[';
    for (let i = 1; i <= 5; i++) {
        meta.html += `"/img/rooms/${room.code}/${i}.avif"`;
        if (i < 5) meta.html += ',';
    }
    meta.html += ']';

    const seo = getSeo(meta, req, "/css/room.css");

    const maps = await Map.findOne({ where: { name: room.Accomodation.name }, raw: true });
    res.status(200).render('room', { room, code, maps, seo });
});

const venues = await Venue.findAll();
for (const venue of venues) {
    router.get(`/${venue.code}`, async (req, res) => {

        ['features', 'events'].forEach(key => {
            if (typeof venue[key] === 'string') {
                try {
                    venue[key] = JSON.parse(venue[key]);
                } catch {
                    venue[key] = [];
                }
            }
        });
        const maps = await Map.findOne({ where: { name: venue.name }, raw: true });

        const meta = await Page.findOne({ where: { type: 'seo', slug: venue.code } });
        meta.html = '[';
        for (let i = 1; i <= 5; i++) {
            meta.html += `"/img/${venue.code}/G${i}.avif"`;
            if (i < 5) meta.html += ',';
        }
        meta.html += ']';
        meta.thumbnail = `/img/${venue.code}/1.avif`;

        const seo = getSeo(meta, req, `/css/venue.css`);

        res.status(200).render('venue', { venue, venues, maps, seo });
    });
}

router.get('/gallery', async (req, res) => {
    const meta = await Page.findOne({ where: { type: 'seo', slug: 'gallery' }, raw: true });
    const weddings = JSON.parse((meta.html || '[]').replace(/'/g, '"'));
    meta.html = '[';
    for (let i = 0; i < weddings.length; i++) {
        meta.html += `"/img/gallery/${weddings[i]}/${weddings[i]} Alyasa Village (1).avif"`;
        if (i < weddings.length - 1) meta.html += ',';
    }
    meta.html += ']';

    const seo = getSeo(meta, req, "/css/gallery.css");

    res.status(200).render('gallery', { weddings, seo });
});

router.get('/gallery/:name', async (req, res) => {
    const { name } = req.params;

    const meta = await Page.findOne({ where: { type: 'seo', slug: 'gallery' }, raw: true });
    meta.html = '[';
    for (let i = 0; i < 5; i++) {
        meta.html += `"/img/gallery/${name}/${name} Alyasa Village (${i + 1}).avif"`;
        if (i < 5 - 1) meta.html += ',';
    }
    meta.html += ']';

    const seo = getSeo(meta, req, "/css/single-gallery.css");


    res.status(200).render('partials/gallery', { wedding: name, seo });
});

router.get('/activities', async (req, res) => {
    const [touring, sport, meta] = await Promise.all([
        Page.findAll({ where: { type: 'touring' }, raw: true }),
        Page.findAll({ where: { type: 'sport' }, raw: true }),
        Page.findOne({ where: { type: 'seo', slug: 'activities' }, raw: true })
    ]);
    const seo = getSeo(meta, req, "/css/activities.css");
    res.status(200).render('activities', { touring, sport, seo });
});

router.get('/blog', async (req, res) => {
    const [blogs, meta] = await Promise.all([
        Page.findAll({
            where: { type: 'blog' },
            order: [['createdAt', 'DESC']],
            raw: true,
        }),
        Page.findOne({ where: { type: 'seo', slug: 'blog' }, raw: true })
    ]);
    const seo = getSeo(meta, req, "/css/blog.css");
    res.status(200).render('blog', {
        blogs,
        featured: blogs.filter(b => [3, 2, 8].includes(b.id)),
        latest: blogs.slice(0, 5),
        seo
    });
});

router.get('/blog/:slug', async (req, res) => {
    const { slug } = req.params;

    const [blog, featured, latest] = await Promise.all([
        Page.findOne({ where: { slug, type: 'blog' }, raw: true }),
        Page.findAll({
            where: { id: [3, 2, 8], type: 'blog' },
            order: [['createdAt', 'DESC']],
            raw: true,
        }),
        Page.findAll({
            where: { type: 'blog' },
            order: [['createdAt', 'DESC']],
            limit: 5,
            raw: true,
        }),
    ]);

    const meta = { ...blog };
    meta.thumbnail = `/img/blog/${blog.thumbnail}`;
    meta.html = `["/img/blog/${blog.thumbnail}"]`;
    const seo = getSeo(meta, req, "/css/single-blog.css");
    if (!blog) return res.redirect('/');
    res.status(200).render('single-blog', { blog, featured, latest, seo });
});

router.get('/story', async (req, res) => {
    const meta = await Page.findOne({ where: { type: 'seo', slug: 'story' }, raw: true });
    const seo = getSeo(meta, req, "/css/story.css");
    res.status(200).render('story', { seo });
});

router.get('/contact', async (req, res) => {
    const meta = await Page.findOne({ where: { type: 'seo', slug: 'contact' }, raw: true });
    const seo = getSeo(meta, req, "/css/contact.css");
    res.status(200).render('contact', { seo });
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false }
});

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const meta = await Page.findOne({ where: { type: 'seo', slug: 'contact' }, raw: true });
    const seo = getSeo(meta, req, "/css/contact.css");

    try {
        // prepare emails
        const mailToOwner = {
            from: `"${name}" <${email}>`,
            to: "hello@alyasavillage.com",
            subject: "New Contact Form Submission",
            text: message,
            html: `<p>${message}</p><p>From: ${name} (${email})</p>`
        };

        const templatePath = path.join(process.cwd(), "views", "partials", "mail.ejs");
        const html = await ejs.renderFile(templatePath, { name });

        const mailToUser = {
            from: `"Alyasa Village" <hello@alyasavillage.com>`,
            to: email,
            subject: "We Received Your Message",
            html
        };

        // send both emails in parallel
        await Promise.all([
            transporter.sendMail(mailToOwner),
            transporter.sendMail(mailToUser)
        ]);

        res.status(200).render('contact', { success: true, seo });
    } catch (error) {
        console.error(error);
        res.status(500).render('contact', { success: false, seo });
    }
});

router.get('/:page', async (req, res) => {
    const { page } = req.params;
    const html = await Page.findOne({
        where: { slug: page },
        raw: true,
    });

    if (!html) {
        return res.redirect('/');
    }

    const meta = { ...html };
    meta.thumbnail = `/img/blog/${html.thumbnail}`;
    meta.html = `["/img/blog/${meta.thumbnail}"]`;

    const seo = getSeo(meta, req, "");

    res.status(200).render('page', { html, seo });
});

//on 404 redirect to index
router.get('*', (req, res) => {
    res.redirect('/');
});


function getSeo(meta, req, css) {
    const baseUrl = req.protocol + '://' + req.get('host');
    return {
        title: meta.title,
        description: meta.meta_description,
        keywords: meta.meta_keywords,
        url: baseUrl + req.originalUrl,
        meta_title: meta.meta_title,
        image: baseUrl + meta.thumbnail,
        stylesheet: css,
        images: JSON.parse(meta.html).map(img => baseUrl + img)
    };
}


export default router;
