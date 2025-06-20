import { useState } from 'react';
import { useCreateBusiness } from '@/services/admin/business-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ZodObject } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createAccoutSchema, createBusinessOwnerSchema, createBusinessSchema } from '@/utils/schemas';
import { cn, getTypeOfField } from '@/libs/utils';

const CreateNewBusinessOwner = () => {
  const totalSteps = 3;
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(0);
  const steps: { key: string; title: string; description: string; schema: ZodObject<any> }[] = [
    {
      key: 'step1',
      title: 'Step 1: Input Your Account Information',
      description: 'Please fill in your account details to proceed.',
      schema: createAccoutSchema,
    },
    {
      key: 'step2',
      title: 'Step 2: Input Your Personal Information',
      description: 'Please fill in your personal details to proceed.',
      schema: createBusinessOwnerSchema,
    },
    {
      key: 'step3',
      title: 'Step 3: Input Your Business Information',
      description: 'Please fill in your business details to proceed.',
      schema: createBusinessSchema,
    },
  ];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { createBusiness } = useCreateBusiness();

  const currentSchema = steps[step].schema as ZodObject<any>;

  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: Object.fromEntries(Object.keys(currentSchema.shape).map((key) => [key, ''])),
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (data: any) => {
    // Gắn prefix step vào key, ví dụ: 1_name, 2_email

    const newFormData = {
      ...formData,
      ...Object.fromEntries(Object.entries(data).map(([key, value]) => [`${step + 1}_${key}`, value])),
    };
    setFormData(newFormData);

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      await createBusiness({
        username: newFormData['1_username'],
        password: newFormData['1_password'],
        owner_name: newFormData['2_name'],
        owner_address: newFormData['2_address'],
        owner_contact: newFormData['2_phone'],
        business_name: newFormData['3_name'],
        business_address: newFormData['3_address'],
        business_contact: newFormData['3_contact'],
        business_type: newFormData['3_businessType'],
        business_tax_code: newFormData['3_businessTaxCode'],
      });
      toast.success('Form successfully submitted');
      setStep(0);
      setFormData({});
      reset(); // reset react-hook-form fields
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'w-4 h-4 rounded-full transition-all duration-300 ease-in-out',
                index <= step ? 'bg-primary' : 'bg-primary/30',
                index < step && 'bg-primary'
              )}
            />
            {index < totalSteps - 1 && (
              <div className={cn('w-8 h-0.5', index < step ? 'bg-primary' : 'bg-primary/30')} />
            )}
          </div>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} key={step}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4">
              {Object.keys(currentSchema.shape).map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(`module.createBusinessOwnerField.${steps[step].key}.${fieldName}.label`)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(`module.createBusinessOwnerField.${steps[step].key}.${fieldName}.placeholder`)}
                          type={getTypeOfField(fieldName)}
                          value={field.value ?? ''}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        {t(`module.createBusinessOwnerField.${steps[step].key}.${fieldName}.description`)}
                      </FormDescription>
                      <FormMessage
                        defaultValue={t(`module.createBusinessOwnerField.${steps[step].key}.${fieldName}.error`)}
                      />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex justify-between">
                <Button type="button" onClick={handleBack} disabled={step === 0}>
                  Back
                </Button>
                <Button type="submit">{step === totalSteps - 1 ? 'Submit' : 'Next'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewBusinessOwner;
