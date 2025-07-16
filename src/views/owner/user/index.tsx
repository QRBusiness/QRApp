import React from 'react';
import { ACCESS_TOKEN, ADMIN_ROLE, OWNER_ROLE, REFRESH_TOKEN, USER_PERMISSIONS, USER_SESSION } from '@/constants';
import { logoutService } from '@/services/auth-service';
import { useBanksInfo, useConfigureBank, useMyBank } from '@/services/owner/bank-service';
import { useCreateExtendedRequest } from '@/services/owner/request-service';
import { useUpdateUserProfile, useUploadAvatar } from '@/services/user-service';
import {
  Calendar,
  CalendarOff,
  ClockPlus,
  ContactRound,
  Edit,
  IdCardLanyard,
  Landmark,
  LogOut,
  MapPin,
  Phone,
  Shield,
  ShieldUser,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type z from 'zod';
import {
  defaultUserState,
  useSetUserProfile,
  useUserPermissions,
  useUserState,
} from '@/components/common/states/userState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { editUserProfileSchema, ownerExtendExpireDateSchema } from '@/utils/schemas';
import { formattedDate, loadFromLocalStorage, resetTableStorage, saveToLocalStorage } from '@/libs/utils';
import StatusBadge from '../order-management/status/status-baged';
import ConfigureBankAccount from './dialog/configure-bank-dialog';
import EditUserProfileDialog from './dialog/edit-user-profile-dialog';
import OwnerExtendExpireDateDialog from './dialog/extend-expriration-dialog';

const ItemCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-3 justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};

const UserProfile = () => {
  const { t } = useTranslation();
  const user = useUserState();
  const { permissions } = useUserPermissions();
  const [openEditDialog, setOpenEditDialog] = React.useState<boolean>(false);
  const [openExtendDialog, setOpenExtendDialog] = React.useState<boolean>(false);
  const [openConfigureDialog, setOpenConfigureDialog] = React.useState<boolean>(false);

  const { data: myBankData } = useMyBank({
    enabled: user?.role === OWNER_ROLE || user?.role === ADMIN_ROLE,
  });
  const { data: banks } = useBanksInfo({
    enabled: user?.role === OWNER_ROLE || user?.role === ADMIN_ROLE,
  });
  const { configureBank } = useConfigureBank();
  const { updateUserProfile } = useUpdateUserProfile();
  const { uploadAvatar } = useUploadAvatar();
  const { createExtendedRequest } = useCreateExtendedRequest();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
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

  const handleExtendExpireDate = async (data: z.infer<typeof ownerExtendExpireDateSchema>) => {
    createExtendedRequest(data);
  };

  const handleLogout = async () => {
    try {
      const refresh_token = loadFromLocalStorage(REFRESH_TOKEN, 'REFRESH_TOKEN');
      await logoutService({ refresh_token: refresh_token });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login');
      saveToLocalStorage(USER_SESSION, defaultUserState);
      saveToLocalStorage(USER_PERMISSIONS, []);
      saveToLocalStorage(REFRESH_TOKEN, null);
      saveToLocalStorage(ACCESS_TOKEN, null);
      resetTableStorage();
    }
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
                {user.role === 'Admin' ? (
                  <ShieldUser className="size-4 mr-1" />
                ) : (
                  <ContactRound className="size-4 mr-1" />
                )}
                {user.role}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.phone && (
              <ItemCard
                icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                label={t('module.common.readOnlyDialog.phone')}
                value={user.phone}
              />
            )}

            {user.expired_at && (
              <ItemCard
                icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
                label={t('module.common.readOnlyDialog.address')}
                value={user.address}
              />
            )}
            {user.created_at && (
              <ItemCard
                icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                label={t('module.common.readOnlyDialog.createdAt')}
                value={formattedDate(user.created_at)}
              />
            )}
            {user.expired_at && (
              <ItemCard
                icon={<CalendarOff className="w-4 h-4 text-muted-foreground" />}
                label={t('module.common.readOnlyDialog.expiration')}
                value={formattedDate(user.expired_at)}
              />
            )}
            {(user.role === OWNER_ROLE || user.role === ADMIN_ROLE) && myBankData ? (
              <>
                <ItemCard
                  icon={<Landmark className="w-4 h-4 text-muted-foreground" />}
                  label={t('module.common.readOnlyDialog.bank')}
                  value={
                    myBankData
                      ? banks?.[banks?.findIndex((bank) => bank.bin.toString() === myBankData.acqId.toString())]
                          ?.short_name || 'N/A'
                      : 'N/A'
                  }
                />
                <ItemCard
                  icon={<IdCardLanyard className="w-4 h-4 text-muted-foreground" />}
                  label={t('module.common.readOnlyDialog.bankNO')}
                  value={myBankData ? myBankData.accountNo : 'N/A'}
                />
                <ItemCard
                  icon={<User className="w-4 h-4 text-muted-foreground" />}
                  label={t('module.common.readOnlyDialog.bankName')}
                  value={myBankData ? myBankData.accountName : 'N/A'}
                />
              </>
            ) : (
              <div>{t('module.profile.configureBank.noBankConfig')}</div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('module.common.readOnlyDialog.status')}</span>
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
                {t('module.profile.edit.label')}
              </Button>
            </EditUserProfileDialog>
            {user.expired_at && user.role === OWNER_ROLE && (
              <OwnerExtendExpireDateDialog
                open={openExtendDialog}
                onOpenChange={setOpenExtendDialog}
                onSubmit={handleExtendExpireDate}
              >
                <Button className="w-full" variant="outline">
                  <ClockPlus /> {t('module.plan.action.extend')}
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
                  {myBankData
                    ? t('module.profile.configureBank.button.update')
                    : t('module.profile.configureBank.button.configure')}
                </Button>
              </ConfigureBankAccount>
            )}
            <Button onClick={handleLogout} className="w-full" variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              {t('module.authentication.logout')}
            </Button>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('module.profile.permission.label')} ({permissions.length})
            </CardTitle>
            <CardDescription>{t('module.profile.permission.description')}</CardDescription>
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
                  <Badge variant="outline" className="text-sm capitalize">
                    {permission?.code?.split('.')[0]}
                  </Badge>
                </div>
              ))}
            </div>
            {permissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t('module.profile.permission.noPermission')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
