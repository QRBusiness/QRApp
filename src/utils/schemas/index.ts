import { z } from 'zod';

// export const loginSchema = z.object({
//   phone: z
//     .string()
//     .min(10, { message: 'module.authentication.phoneErrorLength' })
//     .max(11, { message: 'module.authentication.phoneErrorLength' })
//     .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
//       message: 'module.authentication.phoneErrorFormat',
//     }),
//   password: z
//     .string()
//     .min(6, { message: 'module.authentication.passwordError' })
//     .max(32, { message: 'module.authentication.passwordError' })
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
//       message: 'module.authentication.passwordComplexityError',
//     }),
// });

export const loginSchema = z.object({
  username: z.string().min(5, { message: 'module.authentication.usernameError' }),
  password: z.string().min(5, { message: 'module.authentication.passwordError' }),
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

export const createBusinessTypeSchema = z.object({
  name: z.string().min(1, { message: 'module.businessTypeManagement.createBusinessTypeField.nameError' }),
});

export const createBusinessOwnerSchema = z.object({
  name: z.string().min(1, { message: 'module.businessOwnerManagement.createBusinessOwnerField.nameError' }),
  address: z.string().min(1, { message: 'module.businessOwnerManagement.createBusinessOwnerField.addressError' }),
  phone: z
    .string()
    .min(10, { message: 'module.businessOwnerManagement.createBusinessOwnerField.phoneError' })
    .max(11, { message: 'module.businessOwnerManagement.createBusinessOwnerField.phoneError' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.businessOwnerManagement.createBusinessOwnerField.phoneFormatError',
    }),
});

export const createAccoutSchema = z
  .object({
    username: z.string().min(1, { message: 'module.accountManagement.createAccountField.nameError' }),
    password: z
      .string()
      .min(5, { message: 'module.accountManagement.createAccountField.passwordError' })
      .max(32, { message: 'module.accountManagement.createAccountField.passwordError' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
        message: 'module.accountManagement.createAccountField.passwordComplexityError',
      }),
    confirmPassword: z.string().min(1, {
      message: 'module.accountManagement.createAccountField.confirmPasswordError',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'module.accountManagement.createAccountField.passwordMismatchError',
  });

export const createBusinessSchema = z.object({
  name: z.string().min(1, { message: 'module.businessManagement.createBusinessField.nameError' }),
  address: z.string().min(1, { message: 'module.businessManagement.createBusinessField.addressError' }),
  contact: z
    .string()
    .min(10, { message: 'module.businessManagement.createBusinessField.contactError' })
    .max(11, { message: 'module.businessManagement.createBusinessField.contactError' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.businessManagement.createBusinessField.contactFormatError',
    }),
  businessType: z.string().min(1, {
    message: 'module.businessManagement.createBusinessField.businessTypeError',
  }),
  businessTaxCode: z.string().min(1, {
    message: 'module.businessManagement.createBusinessField.businessTaxCodeError',
  }),
});
