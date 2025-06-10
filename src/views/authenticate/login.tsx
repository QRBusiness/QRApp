import { DASHBOARD, FORGOT_PASSWORD } from '@/constains';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/utils/schemas';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    // IF FAILED TO LOGIN, SHOW ERROR MESSAGE
    // IF SUCCESSFUL, NAVIGATE TO DASHBOARD OR QR MANAGEMENT
    navigate(DASHBOARD);
  };

  return (
    <Card className="w-full h-full max-w-md mx-auto mt-20 px-2 md:px-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">
          {t('module.authentication.title')}
        </CardTitle>
        <CardDescription>{t('module.authentication.subtitle')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('module.authentication.phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('module.authentication.phonePlaceholder')}
                      {...field}
                      className="w-full"
                      type="tel"
                      maxLength={15}
                    />
                  </FormControl>
                  <FormDescription>{t('module.authentication.phoneDescription')}</FormDescription>
                  <FormMessage defaultValue={t('module.authentication.phoneError')} />
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
                  <FormDescription>
                    {t('module.authentication.passwordDescription')}
                  </FormDescription>
                  <FormMessage defaultValue={t('module.authentication.passwordError')} />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t('module.authentication.loginButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
