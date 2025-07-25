import React from 'react';
import { useDeleteProduct, useUpdateProduct, useUploadProductImage } from '@/services/owner/product-services';
import type { CartItem } from '@/services/user/user-request-service';
import { Edit, Plus, ScanText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CustomAlertDialog } from '@/components/common/dialog/custom-alert-dialog';
import { addToCart } from '@/components/common/states/cartState';
import { useUserPermissions } from '@/components/common/states/userState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AddToCartDialog from '@/views/user/Cart/add-to-cart-dialog';
import { havePermissions } from '@/libs/utils';
import CreateNewMenuDialog from '../../../user/Cart/create-new-menu-dialog';
import ReadOnlyMenuItemDialog from '../dialog/read-only-menu-item-dialog';
import type { Menu } from '../tables/columns';

const MenuCardItem: React.FC<Menu> = ({
  _id,
  image,
  name,
  category,
  subcategory,
  description,
  variants = [],
  options = [],
  created_at,
  updated_at,
}) => {
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const permissionCodes = permissions.map((permission) => permission.code);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [addToCartDialogOpen, setAddToCartDialogOpen] = React.useState(false);

  const { uploadProductImage } = useUploadProductImage();
  const { updateProduct } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();
  const price = variants[0]?.price || 0;
  return (
    <Card key={_id} className="flex overflow-hidden border shadow-sm p-1 relative flex-col justify-between">
      <div className="flex flex-row gap-2 items-start">
        <div className="flex flex-row gap-2 items-start w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-md">
            <img src={image} alt={name} className="object-cover w-full h-full object-top rounded-md" />
          </div>
          <div className="flex justify-between items-start flex-1 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-start justify-between">
                <div className="flex flex-col flex-1">
                  <h3 className="font-semibold text-black text-base mb-1">{name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-primary">
                    {price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-start gap-1">
                <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                  {category.name}
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium px-2 py-1 rounded">
                  {subcategory.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 justify-end">
        <ReadOnlyMenuItemDialog
          isOpen={viewDialogOpen}
          onClose={setViewDialogOpen}
          data={{
            _id,
            name,
            category,
            subcategory,
            image,
            options,
            variants,
            description,
            created_at,
            updated_at,
          }}
        >
          <Button
            size="icon"
            className="rounded-full"
            disabled={!havePermissions(permissionCodes, ['view.product'])}
            variant={'outline'}
          >
            <ScanText className="size-4 md:size-5" />
          </Button>
        </ReadOnlyMenuItemDialog>
        <CreateNewMenuDialog
          open={editDialogOpen}
          isCreate={false}
          onOpenChange={setEditDialogOpen}
          initialValues={{
            name,
            category: category._id,
            sub_category: subcategory._id,
            options,
            variants,
            description,
          }}
          onSubmit={async (values) => {
            await updateProduct({ id: _id, data: values });
            await uploadProductImage({ id: _id, file: values.image as File });
            setEditDialogOpen(false);
          }}
        >
          <Button
            size="icon"
            className="rounded-full"
            disabled={!havePermissions(permissionCodes, ['update.product'])}
            variant={'outline'}
          >
            <Edit className="size-4 md:size-5" />
          </Button>
        </CreateNewMenuDialog>
        <AddToCartDialog
          open={addToCartDialogOpen}
          onOpenChange={setAddToCartDialogOpen}
          item={{
            _id,
            name,
            category,
            subcategory,
            image,
            options,
            variants,
            description,
            created_at,
            updated_at,
          }}
          onSubmit={(cartItem: CartItem) => addToCart(cartItem)}
        >
          <Button size="icon" className="rounded-full" variant={'default'}>
            <Plus className="size-4 md:size-5" />
          </Button>
        </AddToCartDialog>
        <CustomAlertDialog
          title={t('module.qrManagement.alertDialog.title')}
          description={t('module.qrManagement.alertDialog.description')}
          onSubmit={() => deleteProduct(_id)}
        >
          <Button
            size="icon"
            className="rounded-full"
            disabled={!havePermissions(permissionCodes, ['delete.product'])}
            variant={'destructive'}
          >
            <X className="size-4 md:size-5" />
          </Button>
        </CustomAlertDialog>
      </div>
    </Card>
  );
};

export default MenuCardItem;
