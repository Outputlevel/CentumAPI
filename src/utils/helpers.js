export function getFirstKeyValue(obj) {
    if (obj && typeof obj === 'object' && Object.keys(obj).length > 0) {
        const key = Object.keys(obj)[0];
        return obj[key];
    }
    return undefined; // Or handle it with a fallback if needed
}