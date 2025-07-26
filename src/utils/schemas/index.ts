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

const blobOrFileSchema = z.instanceof(Blob).or(z.instanceof(File)).or(z.string().url());

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
  description: z.string().nullish(),
  branch: z.string().min(1, { message: 'module.qrManagement.addAreaField.fieldBranchIdError' }),
});

export const createTableSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldNameError' }),
  area: z.string().min(1, { message: 'module.qrManagement.addTableField.fieldAreaIdError' }),
  description: z.string().nullish(),
  qr_code: blobOrFileSchema.nullish(),
});

export const createAdditionalFieldSchema = z.object({
  name: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldNameError' }),
  value: z.string().min(1, { message: 'module.qrManagement.additionalField.fieldValueError' }),
});

export const createMenuCategorySchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuCategoryField.nameError' }),
  description: z.string().nullish(),
});

export const createMenuSubCategorySchema = z.object({
  name: z.string().min(1, { message: 'module.menuManagement.createMenuSubCategoryField.nameError' }),
  description: z.string().nullish(),
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
  description: z.string().nullish(),
  categoryName: z.string().min(1, {
    message: 'module.menuManagement.createMenuField.categoryNameError',
  }),
  subCategoryName: z.string().min(1, {
    message: 'module.menuManagement.createMenuField.subCategoryNameError',
  }),
  sizes: z.array(createMenuItemSizeSchema).min(1, { message: 'module.menuManagement.createMenuField.sizeError' }),
  options: z.array(createMenuItemOptionSchema).nullish(),
});

export const createBusinessTypeSchema = z.object({
  name: z.string().min(1, { message: 'module.businessType.createField.nameError' }),
  description: z.string().nullish(),
});

export const createBusinessOwnerSchema = z.object({
  name_BO: z.string().min(1, { message: 'module.createBusinessOwnerField.step2.name.error' }),
  address_BO: z.string().min(1, { message: 'module.createBusinessOwnerField.step2.address.error' }),
  phone_BO: z
    .string()
    .min(10, { message: 'module.createBusinessOwnerField.step2.phone.error' })
    .max(11, { message: 'module.createBusinessOwnerField.step2.phone.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.createBusinessOwnerField.step2.phone.formatError',
    }),
  email_BO: z.string().email({ message: 'module.createBusinessOwnerField.step2.email.error' }),
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
  name_B: z.string().min(1, { message: 'module.createBusinessOwnerField.step3.name_B.error' }),
  address_B: z.string().min(1, { message: 'module.createBusinessOwnerField.step3.address_B.error' }),
  contact_B: z
    .string()
    .min(10, { message: 'module.createBusinessOwnerField.step3.contact_B.error' })
    .max(11, { message: 'module.createBusinessOwnerField.step3.contact_B.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.createBusinessOwnerField.step3.contact_B.formatError',
    }),
  businessType: z.string().min(1, {
    message: 'module.createBusinessOwnerField.step3.businessType_B.error',
  }),
  businessTaxCode: z.string().nullish(),
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
  email: z.string().email({ message: 'module.staffManagement.create.email.error' }),
});

export const createBranchSchema = z.object({
  name: z.string().min(1, { message: 'module.branchManagement.createField.name.error' }),
  address: z.string().min(1, { message: 'module.branchManagement.createField.address.error' }),
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
  qr_code: blobOrFileSchema.nullish(),
});

export const createUserSchema = z.object({
  name: z.string().min(0, { message: 'module.staffManagement.create.name.error' }).nullish(),
  username: z.string().min(5, { message: 'module.staffManagement.create.username.error' }),
  password: z
    .string()
    .min(6, { message: 'module.staffManagement.create.password.error' })
    .max(32, { message: 'module.staffManagement.create.password.error' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/, {
      message: 'module.staffManagement.create.password.error',
    }),
  phone: z
    .string()
    .min(10, { message: 'module.staffManagement.create.phone.error' })
    .max(11, { message: 'module.staffManagement.create.phone.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.staffManagement.create.phone.formatError',
    })
    .nullish(),
  address: z.string().min(0, { message: 'module.staffManagement.create.address.error' }).nullish(),
  email: z.string().email({ message: 'module.staffManagement.create.email.error' }),
  branch: z.string().min(1, { message: 'module.staffManagement.create.branch.error' }),
});

export const createGroupSchema = z.object({
  name: z.string().min(1, { message: 'module.staffManagement.createGroup.name.error' }),
  description: z.string().nullish(),
});

export const createCategoriesSchema = z.object({
  name: z.string().min(1, { message: 'module.categoriesMgmt.create.name.error' }),
  description: z.string().nullish(),
});

export const createSubCategoriesSchema = z.object({
  category: z.string().min(1, { message: 'module.categoriesMgmt.create.category.error' }),
  name: z.string().min(1, { message: 'module.categoriesMgmt.create.name.error' }),
  description: z.string().nullish(),
});

export const createProductSchema = z.object({
  image: blobOrFileSchema.nullish(),
  name: z.string().min(1, { message: 'module.menuManagement.createMenuField.nameError' }),
  description: z.string().nullish(),
  category: z.string().min(1, { message: 'module.menuManagement.createMenuField.categoryError' }),
  sub_category: z.string().min(1, { message: 'module.menuManagement.createMenuField.subcategoryError' }),
  variants: z
    .array(
      z.object({
        type: z.string().min(1, { message: 'module.productMgmt.create.variantName.error' }),
        price: z.number().min(0, { message: 'module.productMgmt.create.variantPrice.error' }),
      })
    )
    .optional(),
  options: z
    .array(
      z.object({
        type: z.string().min(1, { message: 'module.productMgmt.create.optionName.error' }),
        price: z.number().min(0, { message: 'module.productMgmt.create.optionPrice.error' }),
      })
    )
    .optional(),
});

export const createGuestUserSchema = z.object({
  name: z.string().min(1, { message: 'module.guestUser.create.name.error' }),
});

export const editUserProfileSchema = z.object({
  name: z.string().min(1, { message: 'module.profile.edit.name.error' }),
  phone: z
    .string()
    .min(10, { message: 'module.profile.edit.phone.error' })
    .max(11, { message: 'module.profile.edit.phone.error' })
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, {
      message: 'module.profile.edit.phone.formatError',
    }),
  address: z.string().min(1, { message: 'module.profile.edit.address.error' }),
  image_url: z.instanceof(File).optional(),
});

export const extendExpireDateSchema = z.object({
  plan: z.string().min(1, { message: 'module.business.extend.plan.error' }),
});

export const ownerExtendExpireDateSchema = z.object({
  plan: z.string().min(1, { message: 'module.business.extend.plan.error' }),
  image: z.instanceof(File),
});

export const configureBanksSchema = z.object({
  accountNo: z.string().min(1, { message: 'module.profile.configureBank.accountNumber.error' }),
  accountName: z.string().min(1, { message: 'module.profile.configureBank.accountName.error' }),
  bin: z.string().min(1, { message: 'module.profile.configureBank.bank.error' }),
});

export const createRequestSchema = z.object({
  request: z.string().min(1, { message: '' }),
});

export const createPlanSchema = z.object({
  name: z.string().min(1, { message: 'module.plan.create.name.error' }),
  period: z.number().min(1, { message: 'module.plan.create.period.error' }), // in days
});

export const updatePlanSchema = z.object({
  name: z.string().min(1, { message: 'module.plan.edit.name.error' }),
  period: z.number().min(1, { message: 'module.plan.edit.period.error' }), // in days
  price: z.number().min(0, { message: 'module.plan.edit.price.error' }),
});

export const createOrderRequestSchema = z.object({
  branch: z.string().min(1, { message: 'module.orderRequest.create.branch.error' }),
  area: z.string().min(1, { message: 'module.orderRequest.create.area.error' }),
  service_unit: z.string().min(1, { message: 'module.orderRequest.create.serviceUnit.error' }),
  guest_name: z.string().min(1, { message: 'module.orderRequest.create.guestName.error' }),
});
