import z from "zod";

export const userSchema = z.object({
  name: z
    .string({ invalid_type_error: "Debe ser una cadena de texto" })
    .min(3, "El nombre debe ser mínimo 3")
    .max(50, "El nombre es demasiado largo"),
  lastName: z
    .string({ invalid_type_error: "Debe ser una cadena de texto" })
    .min(3, "El apellido debe ser mínimo 3")
    .max(50, "El apellido es demasiado largo"),
  email: z
    .string({
      invalid_type_error: "El correo es requerido.",
    })
    .email("Debe ser un email válido."),
  password: z
    .string({
      invalid_type_error: "La contraseña es requerida.",
    })
    .min(5, "La contraseña debe tener al menos 5 caracteres"),
});

const platoDetailSchema = z.object({
  name: z.string(),
  prices: z.array(z.number()).min(1).max(4), // Al menos un precio requerido
});

export const menuSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z
    .string()
    .url()
    .default(
      "https://media.istockphoto.com/id/1311705006/es/foto/borde-de-la-esquina-de-la-barra-de-tacos-con-una-variedad-de-ingredientes-sobre-un-fondo-de.webp?b=1&s=170667a&w=0&k=20&c=9GMmVxqS5lERH02jq7DQBDFVMG0vnK3B0E8QuUSX1Ko="
    ),
  status: z.boolean().default(false),
  user_create: z.string(),
  entradas: z.array(platoDetailSchema).default([]),
  principal: z.array(platoDetailSchema).default([]),
  postres: z.array(platoDetailSchema).default([]),
  especiales: z.array(platoDetailSchema).default([]),
});
