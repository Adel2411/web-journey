const userFormatter = (user) => {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		age: user.age,
		createdAt: user.createdAt,
	};
};

export default userFormatter;
