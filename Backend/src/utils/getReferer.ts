const allowedReferers = (req: express.Request) => {
    const referrer = req.get('Referer') || ''; // Get the Referer header

    // Allow only specific frontend URLs
    const allowedDomains = ['https://easy-url-blue.vercel.app', 'https://yourdomain.com'];
    
    const isValidReferrer = allowedDomains.some((domain) => referrer.startsWith(domain));
};