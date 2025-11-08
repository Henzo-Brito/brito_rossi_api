import "dotenv/config"
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
	validatorCompiler,
	serializerCompiler,
	type ZodTypeProvider,
	jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { routes } from "./routes/users.js";

const app = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });


app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "britorossi Api",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(routes);

const PORT = 4000;

app.listen({
	host: "0.0.0.0",
	port: PORT,
});
