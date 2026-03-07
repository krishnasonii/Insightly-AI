const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    console.log('DEBUG: VITE_API_URL from environment:', envUrl);

    if (envUrl) return envUrl;

    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const renderUrl = 'https://insightly-ai.onrender.com';
        console.log(`DEBUG: Production detected, using direct Render URL fallback: ${renderUrl}`);
        return renderUrl;
    }

    const fallback = 'http://localhost:5001';
    console.warn(`DEBUG: VITE_API_URL not found, using local fallback: ${fallback}`);
    return fallback;
};

export const API_BASE_URL = getApiUrl();
