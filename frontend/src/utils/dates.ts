export const isFutureDate = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString >= today;
};
