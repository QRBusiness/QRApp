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
  username: z.string().min(1, { message: 'module.authentication.usernameError' }),
  password: z.string().min(1, { message: 'module.authentication.passwordError' }),
});

export const createQRSchema = z.object({
  branch: z.string().min(1, { message: 'module.qrManagement.branchError' }),
  area: z.string().min(1, { message: 'module.qrManagement.areaError' }),
  table: z.string().min(1, { message: 'module.qrManagement.tableError' }),
});

export const createAreaSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addAreaField.fieldNameError' }),
  description: z.string().optional(),
  image_url: z.string().optional(),
  branch: z.string().min(1, { message: 'module.qrManagement.addAreaField.fieldBranchIdError' }),
});

export const createTableSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldNameError' }),
  area: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldAreaIdError' }),
  description: z.string().optional(),
  qr_code: z.string().optional(),
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
  name: z.string().min(1, { message: 'module.businessType.createField.nameError' }),
  description: z.string().optional(),
});

export const createBusinessOwnerSchema = z.object({
  name: z.string().min(1, { message: 'module.createBusinessOwnerField.step2.name.error' }),
  address: z.string().min(1, { message: 'module.createBusinessOwnerField.step2.address.error' }),
  phone: z
    .string()
    .min(10, { message: 'module.createBusinessOwnerField.step2.phone.error' })
    .max(11, { message: 'module.createBusinessOwnerField.step2.phone.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.createBusinessOwnerField.step2.phone.formatError',
    }),
});

export const createAccoutSchema = z.object({
  username: z.string().min(5, { message: 'module.createBusinessOwnerField.step1.username.error' }),
  password: z
    .string()
    .min(5, { message: 'module.createBusinessOwnerField.step1.password.error' })
    .max(32, { message: 'module.createBusinessOwnerField.step1.password.error' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
      message: 'module.createBusinessOwnerField.step1.password.error',
    }),
  confirmPassword: z.string().min(5, {
    message: 'module.createBusinessOwnerField.step1.confirmPassword.error',
  }),
});

export const createBusinessSchema = z.object({
  name: z.string().min(1, { message: 'module.createBusinessOwnerField.step3.name.error' }),
  address: z.string().min(1, { message: 'module.createBusinessOwnerField.step3.address.error' }),
  contact: z
    .string()
    .min(10, { message: 'module.createBusinessOwnerField.step3.contact.error' })
    .max(11, { message: 'module.createBusinessOwnerField.step3.contact.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.createBusinessOwnerField.step3.contact.formatError',
    }),
  businessType: z.string().min(1, {
    message: 'module.createBusinessOwnerField.step3.businessType.error',
  }),
  businessTaxCode: z.string().optional(),
});

export const editUserSchema = z.object({
  name: z.string().min(1, { message: 'module.businessOwner.editField.name.error' }),
  phone: z
    .string()
    .min(10, { message: 'module.businessOwner.editField.phone.error' })
    .max(11, { message: 'module.businessOwner.editField.phone.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.businessOwner.editField.phone.formatError',
    }),
  address: z.string().min(1, { message: 'module.businessOwner.editField.address.error' }),
  role: z.string().min(1, { message: 'module.businessOwner.editField.role.error' }),
  available: z.boolean(),
  username: z.string().min(5, { message: 'module.businessOwner.editField.username.error' }),
});

export const createBranchSchema = z.object({
  name: z.string().min(5, { message: 'module.branchManagement.createField.name.error' }),
  address: z.string().min(5, { message: 'module.branchManagement.createField.address.error' }),
  contact: z
    .string()
    .min(10, { message: 'module.branchManagement.createField.contact.error' })
    .max(11, { message: 'module.branchManagement.createField.contact.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.branchManagement.createField.contact.formatError',
    }),
});

export const updateTableSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldNameError' }),
  // qr_code: z.instanceof(File).optional(), // chấp nhận null
  qr_code: z.string().optional(), // Assuming qr_code is a string URL or path
});
