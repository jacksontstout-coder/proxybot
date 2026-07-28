export default async function handler(req, res) {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('Missing target URL');
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
    }
    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!response.ok) return res.status(response.status).send(`Failed to load site`);
        const data = await response.text();
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }
}
