import { useRef } from 'react';
import { useCheckoutOrder, useOrderById, useQRPayment } from '@/services/owner/order-service';
import * as htmlToImage from 'html-to-image';
import { CreditCard, Printer, QrCode, WalletCards } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formattedDate } from '@/libs/utils';

const PaymentOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const { qrPayment } = useQRPayment(id!);
  const { orderDetails } = useOrderById(id!);
  const { checkoutOrder } = useCheckoutOrder();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const calculateTotalAmount = () => {
    if (!orderDetails || !orderDetails.items) return 0;
    return orderDetails.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleDownLoadInvoice = () => {
    if (!invoiceRef.current) return;
    return htmlToImage.toPng(invoiceRef.current, { quality: 1 }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `downloaded-invoice-${orderDetails?._id}.png`;
      link.href = dataUrl;
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="lg:min-h-screen flex justify-center py-10 px-4 w-full">
      <div className="w-full max-w-3xl">
        <Card className="p-8 shadow-lg">
          <div ref={invoiceRef} className="space-y-6 bg-background text-foreground p-4 rounded-2xl">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 ">PAYMENT INVOICE</h1>
              <div className="flex flex-col justify-center items-start">
                <p className="text-muted-foreground mb-2 md:mb-0">
                  <span className="font-semibold">Order ID:</span> {orderDetails?._id}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Created Date:</span>{' '}
                  {formattedDate(orderDetails?.created_at ?? new Date().toISOString())}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Guest Name:</span> {orderDetails?.request?.guest_name || 'Unknown'}
                </p>
              </div>
            </div>
            <Separator className="my-2" />
            {/* Total Payment */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center ">
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
                    {orderDetails?.items.map((item) => (
                      <TableRow key={item.product._id}>
                        <TableCell className="font-medium">
                          {item.name} ({item.variant})
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted">
                      <TableCell colSpan={3} className="font-semibold text-right text-lg">
                        Total
                      </TableCell>
                      <TableCell className="font-semibold text-right text-lg text-primary">
                        {calculateTotalAmount()?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <Separator className="my-6" />
            {/* Order Status and QR Code */}
            <div className="flex flex-col justify-between items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-4 flex items-start">
                  <QrCode className="fas fa-qrcode mr-2" /> Scan QR Code to Pay
                </h2>
                <div className="bg-white flex justify-center">
                  <div className="w-48 h-48 md:h-72 md:w-72 bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={qrPayment?.data.qrDataURL}
                      alt="Mã QR thanh toán"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 mt-8">
            <Button variant={'outline'} onClick={handleDownLoadInvoice}>
              <Printer />
              <p className="block lg:hidden:">Download Invoice</p>
            </Button>
            <Button variant={'default'} onClick={() => checkoutOrder({ orderId: id!, method: 'Cash' })}>
              <WalletCards className="mr-2 size-4 md:size-5" /> <p>Confirm Cash</p>
            </Button>
            <Button
              variant={'default'}
              onClick={() => checkoutOrder({ orderId: id!, method: 'Bank' })}
              className="flex items-center justify-center"
            >
              <CreditCard className="mr-2 size-4 md:size-5" /> <p>Confirm Bank Transfer</p>
            </Button>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>Thank you for using our service!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentOrderPage;
