import { useState } from 'react';
import {
  ACCESS_TOKEN,
  ADMIN,
  ADMIN_ROLE,
  BUSINESS_TYPE,
  DASHBOARD,
  FORGOT_PASSWORD,
  OWNER,
  OWNER_ROLE,
  REFRESH_TOKEN,
  STAFF_ROLE,
} from '@/constants';
import { loginService } from '@/services/auth-service';
import { type UserProfile, getCurrentUser, getUserPermissions } from '@/services/user-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LoadingIcon } from '@/components/common/loading';
import { setUserPermissions, setUserState } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/utils/schemas';
import { saveToLocalStorage } from '@/libs/utils';

const Login = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    let user: UserProfile | null = null;
    try {
      setIsLoading(true);
      const response = await loginService(values);
      saveToLocalStorage(ACCESS_TOKEN, response.data.access_token);
      saveToLocalStorage(REFRESH_TOKEN, response.data.refresh_token);
      user = await getCurrentUser();
      setUserState({
        _id: user.data._id,
        name: user.data.name,
        phone: user.data.phone,
        address: user.data.address,
        image_url: user.data.image_url,
        created_at: user.data.created_at,
        updated_at: user.data.updated_at,
        role: user.data.role,
        username: user.data.username,
        available: user.data.available,
        business: {
          _id: user.data.business?._id || '1',
        },
      });
      const permissions = await getUserPermissions();
      setUserPermissions(permissions);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
      if (user?.data?.role === OWNER_ROLE || user?.data?.role === STAFF_ROLE) {
        navigate(`${OWNER}/${user?.data?.business?._id || '1'}/${DASHBOARD}`);
      } else if (user?.data?.role === ADMIN_ROLE) {
        navigate(`${ADMIN}/${BUSINESS_TYPE}`);
      }
      form.reset();
      // IF SUCCESSFUL, NAVIGATE TO DASHBOARD OR QR MANAGEMENT
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full h-full max-w-md mx-auto mt-20 px-2 md:px-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-4">{t('module.authentication.title')}</CardTitle>
          <CardDescription>{t('module.authentication.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('module.authentication.username')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('module.authentication.usernamePlaceholder')}
                        {...field}
                        className="w-full"
                        type="text"
                        maxLength={15}
                      />
                    </FormControl>
                    <FormDescription>{t('module.authentication.usernameDescription')}</FormDescription>
                    <FormMessage defaultValue={t('module.authentication.usernameError')} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('module.authentication.password')}</FormLabel>
                      <span
                        className="text-sm underline text-primary/40 hover:text-primary/85 cursor-pointer"
                        onClick={() => navigate(FORGOT_PASSWORD)}
                      >
                        {t('module.authentication.forgotPassword')}
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t('module.authentication.passwordPlaceholder')}
                        {...field}
                        className="w-full"
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>{t('module.authentication.passwordDescription')}</FormDescription>
                    <FormMessage defaultValue={t('module.authentication.passwordError')} />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isLoading ? <LoadingIcon /> : t('module.authentication.loginButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
