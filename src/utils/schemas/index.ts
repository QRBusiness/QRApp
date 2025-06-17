import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'module.authentication.phoneErrorLength' })
    .max(11, { message: 'module.authentication.phoneErrorLength' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.authentication.phoneErrorFormat',
    }),
  password: z
    .string()
    .min(6, { message: 'module.authentication.passwordError' })
    .max(32, { message: 'module.authentication.passwordError' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
      message: 'module.authentication.passwordComplexityError',
    }),
});

export const createQRSchema = z.object({
  area: z.string().min(1, { message: 'module.qrManagement.areaError' }),
  table: z.string().min(1, { message: 'module.qrManagement.tableError' }),
});

export const createAreaSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addAreaField.fieldNameError' }),
  description: z.string().min(1, {
    message: 'module.qrManagement.addAreaField.fieldDescriptionError',
  }),
});

export const createTableSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldNameError' }),
  areaId: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldAreaIdError' }),
  description: z.string().min(1, {
    message: 'module.qrManagement.addTableField.fieldDescriptionError',
  }),
});

export const createAdditionalFieldSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldNameError' }),
  value: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldValueError' }),
});

export const createMenuCategorySchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuCategoryField.nameError' }),
  description: z.string().min(1, {
    message: 'module.menuManagement.createMenuCategoryField.fieldDescriptionError',
  }),
});

export const createMenuSubCategorySchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuSubCategoryField.nameError' }),
  description: z.string().min(1, {
    message: 'module.menuManagement.createMenuSubCategoryField.fieldDescriptionError',
  }),
  categoryName: z.string().min(1, {
    message: 'module.menuManagement.createMenuSubCategoryField.categoryNameError',
  }),
});

export const createMenuItemSizeSchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuItemSizeField.nameError' }),
  price: z.number().min(0, { message: 'module.menuManagement.createMenuItemSizeField.priceError' }),
});

export const createMenuItemOptionSchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuItemOptionField.nameError' }),
  price: z.number().min(0, { message: 'module.menuManagement.createMenuItemOptionField.priceError' }),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuField.nameError' }),
  description: z.string().min(1, {
    message: 'module.menuManagement.createMenuField.descriptionError',
  }),
  categoryName: z.string().min(1, {
    message: 'module.menuManagement.createMenuField.categoryNameError',
  }),
  subCategoryName: z.string().min(1, {
    message: 'module.menuManagement.createMenuField.subCategoryNameError',
  }),
  sizes: z.array(createMenuItemSizeSchema).min(1, { message: 'module.menuManagement.createMenuField.sizeError' }),
  options: z.array(createMenuItemOptionSchema).optional(),
});
