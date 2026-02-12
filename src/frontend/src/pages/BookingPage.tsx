import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { useCreateBooking } from '@/hooks/useBookings';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import LoginButton from '@/components/auth/LoginButton';

export default function BookingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createBooking = useCreateBooking();

  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    deviceModel: '',
    issueDescription: '',
    preferredDate: '',
    preferredTime: '',
    photoNotes: '',
    paymentMethod: 'cash',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingId, setBookingId] = useState<bigint | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.deviceModel.trim()) {
      newErrors.deviceModel = 'Device model is required';
    }

    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Issue description is required';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Preferred time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const preferredDateTime = BigInt(dateTime.getTime()) * BigInt(1_000_000);

      const id = await createBooking.mutateAsync({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        deviceModel: formData.deviceModel,
        issueDescription: formData.issueDescription,
        preferredDateTime,
        photoNotes: formData.photoNotes || undefined,
        paymentMethod: formData.paymentMethod,
      });

      setBookingId(id);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (bookingId !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-2 border-green-500/20">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
                <p className="text-muted-foreground">Your repair booking has been successfully submitted</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="text-2xl font-bold text-amber-600">#{bookingId.toString()}</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>We will contact you shortly at {formData.phoneNumber} to confirm your appointment.</p>
                <p>Please keep your booking reference number for future communication.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookingId(null);
                    setFormData({
                      customerName: '',
                      phoneNumber: '',
                      deviceModel: '',
                      issueDescription: '',
                      preferredDate: '',
                      preferredTime: '',
                      photoNotes: '',
                      paymentMethod: 'cash',
                    });
                  }}
                >
                  Book Another Repair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Repair</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you shortly to confirm your appointment
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Admin Access */}
          {identity && (
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium">Shop Staff?</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate({ to: '/admin/bookings' })}>
                  View All Bookings
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Repair Booking Form</CardTitle>
              <CardDescription>
                Please provide your details and device information. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    Customer Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className={errors.customerName ? 'border-destructive' : ''}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">{errors.customerName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className={errors.phoneNumber ? 'border-destructive' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Device Model */}
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">
                    Device Model <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="deviceModel"
                    placeholder="e.g., iPhone 13, Samsung Galaxy S21"
                    value={formData.deviceModel}
                    onChange={(e) => handleChange('deviceModel', e.target.value)}
                    className={errors.deviceModel ? 'border-destructive' : ''}
                  />
                  {errors.deviceModel && (
                    <p className="text-sm text-destructive">{errors.deviceModel}</p>
                  )}
                </div>

                {/* Issue Description */}
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">
                    Issue Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="issueDescription"
                    placeholder="Describe the problem with your device in detail"
                    value={formData.issueDescription}
                    onChange={(e) => handleChange('issueDescription', e.target.value)}
                    className={errors.issueDescription ? 'border-destructive' : ''}
                    rows={4}
                  />
                  {errors.issueDescription && (
                    <p className="text-sm text-destructive">{errors.issueDescription}</p>
                  )}
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">
                      Preferred Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleChange('preferredDate', e.target.value)}
                      className={errors.preferredDate ? 'border-destructive' : ''}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.preferredDate && (
                      <p className="text-sm text-destructive">{errors.preferredDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">
                      Preferred Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => handleChange('preferredTime', e.target.value)}
                      className={errors.preferredTime ? 'border-destructive' : ''}
                    />
                    {errors.preferredTime && (
                      <p className="text-sm text-destructive">{errors.preferredTime}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card on Delivery</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Photo Notes */}
                <div className="space-y-2">
                  <Label htmlFor="photoNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="photoNotes"
                    placeholder="Any additional information or special requests"
                    value={formData.photoNotes}
                    onChange={(e) => handleChange('photoNotes', e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can describe any visible damage or provide additional context here
                  </p>
                </div>

                {/* Error Alert */}
                {createBooking.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to submit booking. Please try again or contact us directly.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
