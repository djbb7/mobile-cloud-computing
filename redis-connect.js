var redis   = require("redis");

if (process.env.REDIS_PORT && process.env.REDIS_HOST && process.env.REDIS_PASSWORD) {
	var client  = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
	client.auth(process.env.REDIS_PASSWORD);
} else {
	client = redis.createClient();
}

client.on('connect', function() {
	exports.client = client;
});