import {z} from 'zod';

export const userSchema=z.object({
	email:z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
	password:z.string().min(6,"password must be atleast 6 letter long")
})