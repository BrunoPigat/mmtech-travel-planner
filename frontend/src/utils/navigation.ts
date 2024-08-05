export const redirectTo = (path: string) => {
    if (typeof window !== 'undefined') {
        window.location.href = path;
    }
};