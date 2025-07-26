import { useMemo, useRef } from 'react';
import { ORDER_MANAGEMENT } from '@/constants';
import { type ItemOrderProps, useCheckoutOrder, useOrderById, useOrderByToken } from '@/services/owner/order-service';
import * as htmlToImage from 'html-to-image';
import { CreditCard, Printer, QrCode, WalletCards } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formattedDate } from '@/libs/utils';

const PaymentOrderPage = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { id, businessId } = useParams<{ id: string; businessId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();
  const { checkoutOrder } = useCheckoutOrder();
  const { orderDetails } = useOrderById(id!);
  const { items: tokenItems, qr_code } = useOrderByToken(token!);

  // Optimize item processing with useMemo
  const mergedItems: ItemOrderProps[] = useMemo(() => {
    if (!tokenItems?.length) return orderDetails?.items || [];

    return tokenItems.flatMap((item) => item.items);
  }, [tokenItems, orderDetails?.items]);

  // Optimize total calculation with useMemo
  const totalAmount = useMemo(() => {
    return mergedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [mergedItems]);

  // Extract checkout handlers
  const handleCashPayment = () => {
    checkoutOrder({ token: token!, method: 'Cash' });
    navigate(`/owner/${businessId}/${ORDER_MANAGEMENT}`, { replace: true });
  };
  const handleBankPayment = () => {
    checkoutOrder({ token: token!, method: 'Bank' });
    navigate(`/owner/${businessId}/${ORDER_MANAGEMENT}`, { replace: true });
  };

  const handleDownLoadInvoice = async () => {
    if (!invoiceRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(invoiceRef.current, { quality: 1 });
      const link = document.createElement('a');
      link.download = `invoice-${orderDetails?._id || 'unknown'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  // Format currency helper
  const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const orderInfo = {
    id: orderDetails?._id || 'N/A',
    createdDate: formattedDate(orderDetails?.created_at ?? new Date().toISOString()),
    guestName: orderDetails?.request?.guest_name || 'Unknown',
  };

  return (
    <div className="lg:min-h-screen flex justify-center py-10 px-4 w-full">
      <div className="w-full max-w-3xl">
        <Card className="p-8 shadow-lg">
          <div ref={invoiceRef} className="space-y-6 bg-background text-foreground p-4 rounded-2xl">
            {/* Header */}
            <header className="text-center">
              <h1 className="text-3xl font-bold mb-4">PAYMENT INVOICE</h1>
              <div className="flex flex-col justify-center items-start">
                <p className="text-muted-foreground mb-2 md:mb-0">
                  <span className="font-semibold">Order ID:</span> {orderInfo.id}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Created Date:</span> {orderInfo.createdDate}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Guest Name:</span> {orderInfo.guestName}
                </p>
              </div>
            </header>

            <Separator className="my-2" />

            {/* Payment Summary */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="mr-2 size-4 md:size-5" /> Payment Summary
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mergedItems.map((item, index) => (
                      <TableRow key={`${item.product._id}-${index}`} className="hover:bg-muted">
                        <TableCell className="font-medium">
                          {item.name} ({item.variant})
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted">
                      <TableCell colSpan={3} className="font-semibold text-right text-lg">
                        Total
                      </TableCell>
                      <TableCell className="font-semibold text-right text-lg text-primary">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <Separator className="my-6" />

            {/* QR Code Section */}
            <section className="flex flex-col justify-between items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-4 flex items-start w-full justify-center">
                  <QrCode className="mr-2" /> Scan QR Code to Pay
                </h2>
                <div className="bg-white flex justify-center">
                  <div className="w-48 h-48 md:h-72 md:w-72 bg-white flex items-center justify-center overflow-hidden">
                    {qr_code && <img src={qr_code} alt="Payment QR Code" className="w-full h-full object-contain" />}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 mt-8">
            <Button variant="outline" onClick={handleDownLoadInvoice}>
              <Printer className="mr-2 size-4" />
              <span className="block lg:hidden">Download Invoice</span>
            </Button>
            <Button variant="default" onClick={handleCashPayment}>
              <WalletCards className="mr-2 size-4 md:size-5" />
              <span>Confirm Cash</span>
            </Button>
            <Button variant="default" onClick={handleBankPayment} className="flex items-center justify-center">
              <CreditCard className="mr-2 size-4 md:size-5" />
              <span>Confirm Bank Transfer</span>
            </Button>
          </div>

          <footer className="mt-8 text-center text-muted-foreground text-sm">
            <p>Thank you for using our service!</p>
          </footer>
        </Card>
      </div>
    </div>
  );
};

export default PaymentOrderPage;
