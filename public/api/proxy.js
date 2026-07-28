export default async function handler(req, res) {
    let targetUrl = req.query.url;

    if (!targetUrl) return res.status(400).send('Missing target URL');

    // FIX 1: If the user didn't type a dot (like .com), treat it as a generic search attempt
    if (!targetUrl.includes('.')) {
        targetUrl = '://duckduckgo.com' + encodeURIComponent(targetUrl);
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                // FIX 2: Emulate a real Windows 10 Chrome Browser to bypass basic bot walls
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`The target website refused the connection (Status Code: ${response.status}). Many major search engines block cloud hosting systems.`);
        }

        const data = await response.text();
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(data);

    } catch (error) {
        return res.status(500).send(`Error trying to connect: ${error.message}. Make sure the domain name is spelled correctly.`);
    }
}
