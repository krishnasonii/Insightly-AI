const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL;
    console.log('DEBUG: VITE_API_URL from environment:', url);

    if (url) return url;

    const fallback = 'http://localhost:5001';
    console.warn(`DEBUG: VITE_API_URL not found, using fallback: ${fallback}`);
    return fallback;
};

export const API_BASE_URL = getApiUrl();
