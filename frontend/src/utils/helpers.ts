export const now = () => {
    return new Date().toLocaleString();
};
export const year = () => {
    return new Date().getFullYear();
};

export const generateYears = (startOffset: number, count: number) => {
	const yearCurrent = new Date().getFullYear() - 1;
	const startyear = yearCurrent + startOffset;
	return Array.from({ length: count }, (_, i) => startyear + i);
};
