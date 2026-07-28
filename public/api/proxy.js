export default async function handler(req, res) {
    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    // A list of educational prefixes to generate links resembling reference sites
    const subjects = ['science', 'english', 'history', 'math', 'biology', 'physics', 'studio', 'classroom', 'library', 'archive', 'academy', 'atlas'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)] + '-' + Math.floor(1000 + Math.random() * 9000);

    try {
        // Query Vercel's API to fetch the structural name of your current project
        const projectRes = await fetch(`https://vercel.com{projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const projectData = await projectRes.json();
        const baseName = projectData.name;
        
        // Formulate a completely unique sub-route domain string
        const newDomainName = `${randomSubject}-${baseName}.vercel.app`;

        // Instruct Vercel's network layer to bind this new live routing link instantly
        const assignRes = await fetch(`https://vercel.com{projectId}/domains`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newDomainName })
        });

        if (!assignRes.ok) {
            const errData = await assignRes.json();
            return res.status(500).json({ error: 'API rejection', details: errData });
        }

        // Output the generated string back to the user interface
        return res.status(200).json({ url: newDomainName });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
