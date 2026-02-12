import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Banknote, CheckCircle2 } from 'lucide-react';
import { useGetAllPaymentInstructions } from '@/hooks/usePayments';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentsPage() {
  const { data: instructions, isLoading } = useGetAllPaymentInstructions();

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash on Delivery',
      description: 'Pay with cash when you collect your repaired device',
      icon: <Banknote className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay instantly using UPI apps like Google Pay, PhonePe, or Paytm',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'card',
      name: 'Card on Delivery',
      description: 'Pay with debit or credit card when collecting your device',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Options</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            We offer flexible payment options for your convenience
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Choose Your Payment Method</h2>
            <p className="text-muted-foreground">Select the payment option that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${method.color}`} />
                <CardHeader className="text-center pt-8">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${method.color} text-white flex items-center justify-center mb-4`}>
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.name}</CardTitle>
                  <CardDescription className="text-center">{method.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Payment Instructions
              </CardTitle>
              <CardDescription>Important information about payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : instructions && instructions.length > 0 ? (
                <ul className="space-y-3">
                  {instructions.map(([id, instruction]) => (
                    <li key={id.toString()} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span className="text-sm text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-sm text-muted-foreground">
                      Payment is required upon completion of the repair service
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-sm text-muted-foreground">
                      You can choose your preferred payment method when booking or at the time of collection
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-sm text-muted-foreground">
                      For UPI payments, our payment details will be shared after repair completion
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-sm text-muted-foreground">
                      All repairs come with a warranty - payment receipt will be provided
                    </span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="bg-muted/50 border-amber-200 dark:border-amber-900">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Badge className="bg-amber-600 hover:bg-amber-700 mt-1">Note</Badge>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Secure Payment Process</p>
                  <p className="text-sm text-muted-foreground">
                    We ensure a secure payment process. Your payment method preference can be specified during booking,
                    and the final payment is collected only after you're satisfied with the repair quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
