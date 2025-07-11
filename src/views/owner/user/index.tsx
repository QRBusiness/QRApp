import React from 'react';
import { ADMIN_ROLE, OWNER_ROLE } from '@/constants';
import { useConfigureBank } from '@/services/owner/bank-service';
import { useUpdateUserProfile, useUploadAvatar } from '@/services/user-service';
import { Calendar, CalendarOff, ClockPlus, Edit, Landmark, MapPin, Phone, Shield, User } from 'lucide-react';
import type z from 'zod';
import { useSetUserProfile, useUserPermissions, useUserState } from '@/components/common/states/userState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { editUserProfileSchema } from '@/utils/schemas';
import { formattedDate } from '@/libs/utils';
import StatusBadge from '../order-management/status/status-baged';
import ConfigureBankAccount from './dialog/configure-bank-dialog';
import EditUserProfileDialog from './dialog/edit-user-profile-dialog';
import OwnerExtendExpireDateDialog from './dialog/extend-expriration-dialog';

const UserProfile = () => {
  const user = useUserState();
  const { permissions } = useUserPermissions();
  const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
  const [openExtendDialog, setOpenExtendDialog] = React.useState<boolean>(false);
  const [openConfigureDialog, setOpenConfigureDialog] = React.useState<boolean>(false);

  const { configureBank } = useConfigureBank();
  const { updateUserProfile } = useUpdateUserProfile();
  const { uploadAvatar } = useUploadAvatar();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user || !permissions) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Can't get user information</p>
      </div>
    );
  }

  const handleEditSubmit = async (data: z.infer<typeof editUserProfileSchema>) => {
    if (data?.image_url) {
      await uploadAvatar(data.image_url);
    }
    const response = await updateUserProfile({
      name: data.name,
      phone: data.phone,
      address: data.address,
    });
    useSetUserProfile(response.name, response.phone, response.address, response.image_url || '');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.image_url} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Username:</span>
              <span className="text-sm font-medium">{user.username}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm font-medium">{user.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-sm font-medium">{user.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Joined:</span>
              <span className="text-sm font-medium">{formattedDate(user.created_at)}</span>
            </div>
            {user.expired_at && (
              <div className="flex items-center gap-3">
                <CalendarOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Expires:</span>
                <span className="text-sm font-medium">{formattedDate(user.expired_at)}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <StatusBadge status={user?.available ? 'Active' : 'Inactive'} />
            </div>
            <EditUserProfileDialog
              open={openEditDialog}
              onOpenChange={setOpenEditDialog}
              onSubmit={handleEditSubmit}
              initialData={{
                name: user.name,
                phone: user.phone,
                address: user.address,
                image_url: undefined,
              }}
            >
              <Button className="w-full" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Information
              </Button>
            </EditUserProfileDialog>
            {user.expired_at && user.role === OWNER_ROLE && (
              <OwnerExtendExpireDateDialog open={openExtendDialog} onOpenChange={setOpenExtendDialog}>
                <Button className="w-full" variant="outline">
                  <ClockPlus /> Extend Expiration
                </Button>
              </OwnerExtendExpireDateDialog>
            )}
            {(user.role === OWNER_ROLE || user.role === ADMIN_ROLE) && (
              <ConfigureBankAccount
                open={openConfigureDialog}
                onOpenChange={setOpenConfigureDialog}
                onSubmit={configureBank}
              >
                <Button className="w-full" variant="outline">
                  <Landmark className="w-4 h-4 mr-2" />
                  Configure Bank
                </Button>
              </ConfigureBankAccount>
            )}
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Permissions ({permissions.length})
            </CardTitle>
            <CardDescription>All permissions assigned to this account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissions.map((permission) => (
                <div
                  key={permission._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{permission.description}</div>
                    <div className="text-xs text-muted-foreground">{permission.code}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {permission.code.split('.')[0]}
                  </Badge>
                </div>
              ))}
            </div>
            {permissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No permissions assigned to this account</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
