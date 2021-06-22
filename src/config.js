let { NODE_ENV, VUE_APP_COSMOS_XP_ADDRESS, VUE_APP_IRIS_XP_ADDRESS } = process.env;

export const cfg = {
	env: NODE_ENV,
    cosmosXpAddress:VUE_APP_COSMOS_XP_ADDRESS,
    irisXpAddress:VUE_APP_IRIS_XP_ADDRESS,
};
