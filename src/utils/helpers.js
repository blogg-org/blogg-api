export const getFullnameInitials = (fullname) => {
	const tempArrayNames = fullname.trim().split(" ");
	if (tempArrayNames.length === 1) {
		return tempArrayNames[0][0].toUpperCase();
	} else if (tempArrayNames.length > 1) {
		return `${tempArrayNames[0][0].toUpperCase()}${tempArrayNames[1][0].toUpperCase()}`;
	} else {
		return null;
	}
};

export const generateHashColorValue = () => {
	const hexValues = "0123456789abcdef";
	let hashValue = "#";
	for (let i = 0; i < 6; i++) {
		hashValue += hexValues[Math.floor(Math.random() * 16)];
	}
	return hashValue;
};
