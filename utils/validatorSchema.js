export const validatorSchema = (schema, schemaObject) => {
  return schema.safeParse(schemaObject);
};

export const validatorSchemaPartial = (schema, schemaObject) => {
  return schema.partial().safeParse(schemaObject);
};
