import type { FastifyTypeInstance } from "../types.ts";
import z from "zod";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function routes(app: FastifyTypeInstance) {
	app.get(
		"/users",
		{
			schema: {
				description: "Requery all Users",
				tags: ["users"],
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							description: z.string(),
						})
					),
					500: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (Requery, Result) => {
			try {
				const users = await prisma.user.findMany({
					select: {
						id: true,
						name: true,
						email: true,
						description: true,
					},
					take: 20,
				});

				if (users.length !== 0) {
					return Result.status(200).send(users);
				} else {
					return Result.status(404).send({
						message: "Don't have Users",
					});
				}
			} catch (e) {
				return Result.status(500).send({ message: "Server ERROR" });
			}
		}
	);

	app.get<{
		Params: { name: string };
	}>(
		"/user/:name",
		{
			schema: {
				description: "Return One User",
				tags: ["users"],
				params: z.object({
					name: z.string().max(150).describe("User Name")
				}),
				response: {
					200: z.array(
						z.object({
							id: z.string().uuid(),
							name: z.string(),
							email: z.string(),
							description: z.string(),
						})
					),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		
		async (req, res) => {
			try {
				const { name } = req.params;
				const users = await prisma.user.findMany({
					where: {
						name: {
							contains: name,
							mode: "insensitive"
						}
					},
				});
				if (users.length == 0) {
					return res.status(404).send({ message: "User not found" });
				}
				return res.status(200).send(users);
			} catch (e: any) {

				return res.status(500).send({ message: "Server error" });
			}
		}
	);

	app.post(
		"/user",
		{
			schema: {
				description: "Create a new User",
				tags: ["users"],
				body: z.object({
					name: z.string().max(150),
					email: z.string().email(),
					description: z.string().max(600),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
					409: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (req, res) => {
			const { name, email, description } = req.body as {
				name: string;
				email: string;
				description: string;
			};

			try {
				await prisma.user.create({
					data: {
						name,
						email,
						description,
					},
				});
				return res
					.status(201)
					.send({ message: "User created successfully" });
			} catch (e: any) {
				if (e.code === "P2002") {
					return res
						.status(409)
						.send({ message: "E-mail already exist." });
				}

				return res
					.status(500)
					.send({ message: "The user was not created" });
			}
		}
	);

	app.delete<{
		Params: { id: string };
	}>(
		"/user/:id",
		{
			schema: {
				description: "Delete one user by ID",
				tags: ["users"],
				params: z.object({
					id: z.string().uuid().describe("User ID"),
				}),
				response: {
					200: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (req, res) => {
			try {
				const { id } = req.params;

				await prisma.user.delete({
					where: { id },
				});

				return res
					.status(200)
					.send({ message: "User deleted successfully" });
			} catch (e: any) {
				if (e.code === "P2025") {
					return res.status(404).send({ message: "User not found" });
				}
				return res.status(500).send({ message: "Server error" });
			}
		}
	);
}
