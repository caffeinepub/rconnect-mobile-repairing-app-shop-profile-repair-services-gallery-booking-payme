import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES_CATALOG } from "@/data/servicesCatalog";
import { useCreateBooking } from "@/hooks/useBookings";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { dateTimeToNanoseconds } from "@/utils/time";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, CheckCircle2, Loader2, Wrench } from "lucide-react";
import { useState } from "react";

const ALL_DEVICE_MODELS = [
  // iPhone
  "iPhone 6",
  "iPhone 6s",
  "iPhone 7",
  "iPhone 7 Plus",
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  // Samsung
  "Samsung Galaxy S21",
  "Samsung Galaxy S22",
  "Samsung Galaxy S23",
  "Samsung Galaxy S24",
  "Samsung Galaxy A14",
  "Samsung Galaxy A54",
  "Samsung Galaxy A34",
  "Samsung Galaxy A74",
  "Samsung Galaxy M14",
  "Samsung Galaxy M54",
  // Vivo
  "Vivo V25",
  "Vivo V29",
  "Vivo Y22",
  // OPPO
  "OPPO A78",
  "OPPO A58",
  // Realme
  "Realme 11",
  "Realme 12",
  // OnePlus
  "OnePlus Nord CE3",
  "OnePlus 12",
  // Xiaomi / Redmi
  "Xiaomi Redmi Note 13",
  "Xiaomi Redmi 12",
  // Motorola
  "Motorola Moto G84",
];

export default function BookingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createBooking = useCreateBooking();

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    serviceCategory: "",
    serviceId: "",
    deviceModel: "",
    issueDescription: "",
    preferredDate: "",
    preferredTime: "",
    photoNotes: "",
    repairPrice: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingId, setBookingId] = useState<bigint | null>(null);

  const selectedCategory = SERVICES_CATALOG.find(
    (cat) => cat.id === formData.serviceCategory,
  );
  const availableServices = selectedCategory?.services || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (!formData.serviceCategory) {
      newErrors.serviceCategory = "Please select a service category";
    }
    if (!formData.serviceId) {
      newErrors.serviceId = "Please select a specific service";
    }
    if (!formData.deviceModel.trim()) {
      newErrors.deviceModel = "Model name is required";
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = "Issue description is required";
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required";
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const preferredDateTime = dateTimeToNanoseconds(
        formData.preferredDate,
        formData.preferredTime,
      );
      const selectedService = availableServices.find(
        (s) => s.id === formData.serviceId,
      );
      const serviceName = selectedService?.name || "Service";
      const priceStr = formData.repairPrice ? ` ₹${formData.repairPrice}` : "";
      const fullIssueDescription =
        `[${serviceName}]${priceStr} ${formData.issueDescription}`.trim();

      const id = await createBooking.mutateAsync({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        deviceModel: formData.deviceModel,
        issueDescription: fullIssueDescription,
        preferredDateTime,
        photoNotes: formData.photoNotes || undefined,
        paymentMethod: "cash",
      });

      setBookingId(id);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "serviceCategory") {
        updated.serviceId = "";
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setBookingId(null);
    setFormData({
      customerName: "",
      phoneNumber: "",
      serviceCategory: "",
      serviceId: "",
      deviceModel: "",
      issueDescription: "",
      preferredDate: "",
      preferredTime: "",
      photoNotes: "",
      repairPrice: "",
    });
    setErrors({});
  };

  if (bookingId !== null) {
    return (
      <div className="min-h-screen py-12 pb-safe">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground">
                  Your repair booking has been successfully submitted
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Job Card Number</p>
                <p className="text-2xl font-mono font-bold text-blue-400">
                  #{bookingId.toString()}
                </p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  We will contact you shortly at {formData.phoneNumber} to
                  confirm your appointment.
                </p>
                <p>
                  Please keep your Job Card number for tracking your repair
                  status.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  data-ocid="booking.success.home_button"
                  onClick={() => navigate({ to: "/" })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Back to Home
                </Button>
                <Button
                  data-ocid="booking.success.book_again_button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
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
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wrench className="w-6 h-6 text-blue-400" />
            <span className="text-blue-300 font-mono text-sm tracking-wider uppercase">
              New Repair Entry
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Add Customer Repair
          </h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            Fill in the customer and device details to create a new repair job
            card
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="container mx-auto px-4 py-10 pb-safe">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Admin Access */}
          {identity && (
            <Card className="bg-secondary/30 border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Shop Staff?</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: "/bookings" })}
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
                >
                  View All Bookings
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">
                Repair Booking Form
              </CardTitle>
              <CardDescription>
                Please provide customer details and device information. All
                fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    👤 Customer Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer full name"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleChange("customerName", e.target.value)
                    }
                    className={
                      errors.customerName
                        ? "border-destructive"
                        : "border-border/50 bg-secondary/30"
                    }
                  />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    📞 Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    className={
                      errors.phoneNumber
                        ? "border-destructive"
                        : "border-border/50 bg-secondary/30"
                    }
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Device Model with datalist */}
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">
                    📱 Mobile Model <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="booking.device_model_input"
                    id="deviceModel"
                    list="device-models"
                    placeholder="e.g., iPhone 13, Samsung Galaxy S22"
                    value={formData.deviceModel}
                    onChange={(e) =>
                      handleChange("deviceModel", e.target.value)
                    }
                    className={
                      errors.deviceModel
                        ? "border-destructive"
                        : "border-border/50 bg-secondary/30"
                    }
                    autoComplete="off"
                  />
                  <datalist id="device-models">
                    {ALL_DEVICE_MODELS.map((model) => (
                      <option key={model} value={model} />
                    ))}
                  </datalist>
                  {errors.deviceModel && (
                    <p className="text-sm text-destructive">
                      {errors.deviceModel}
                    </p>
                  )}
                </div>

                {/* Service Category */}
                <div className="space-y-2">
                  <Label htmlFor="serviceCategory">
                    ⚠️ Problem Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.serviceCategory}
                    onValueChange={(value) =>
                      handleChange("serviceCategory", value)
                    }
                  >
                    <SelectTrigger
                      id="serviceCategory"
                      className={
                        errors.serviceCategory
                          ? "border-destructive"
                          : "border-border/50 bg-secondary/30"
                      }
                    >
                      <SelectValue placeholder="Select a service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES_CATALOG.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceCategory && (
                    <p className="text-sm text-destructive">
                      {errors.serviceCategory}
                    </p>
                  )}
                </div>

                {/* Specific Service */}
                {formData.serviceCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">
                      Specific Service{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) =>
                        handleChange("serviceId", value)
                      }
                    >
                      <SelectTrigger
                        id="serviceId"
                        className={
                          errors.serviceId
                            ? "border-destructive"
                            : "border-border/50 bg-secondary/30"
                        }
                      >
                        <SelectValue placeholder="Select a specific service" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex flex-col items-start">
                              <span>{service.name}</span>
                              {service.estimatedTime && (
                                <span className="text-xs text-muted-foreground">
                                  Est. {service.estimatedTime}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceId && (
                      <p className="text-sm text-destructive">
                        {errors.serviceId}
                      </p>
                    )}
                  </div>
                )}

                {/* Issue Description */}
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">
                    Issue Description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="issueDescription"
                    placeholder="Describe the problem with the device in detail"
                    value={formData.issueDescription}
                    onChange={(e) =>
                      handleChange("issueDescription", e.target.value)
                    }
                    className={
                      errors.issueDescription
                        ? "border-destructive"
                        : "border-border/50 bg-secondary/30"
                    }
                    rows={3}
                  />
                  {errors.issueDescription && (
                    <p className="text-sm text-destructive">
                      {errors.issueDescription}
                    </p>
                  )}
                </div>

                {/* Repair Price */}
                <div className="space-y-2">
                  <Label htmlFor="repairPrice">
                    💰 Repair Price (Optional)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      data-ocid="booking.repair_price_input"
                      id="repairPrice"
                      type="number"
                      placeholder="Estimated repair price"
                      value={formData.repairPrice}
                      onChange={(e) =>
                        handleChange("repairPrice", e.target.value)
                      }
                      className="pl-8 border-border/50 bg-secondary/30"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the estimated or agreed repair price
                  </p>
                </div>

                {/* Preferred Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">
                      📅 Preferred Date{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        handleChange("preferredDate", e.target.value)
                      }
                      className={
                        errors.preferredDate
                          ? "border-destructive"
                          : "border-border/50 bg-secondary/30"
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.preferredDate && (
                      <p className="text-sm text-destructive">
                        {errors.preferredDate}
                      </p>
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
                      onChange={(e) =>
                        handleChange("preferredTime", e.target.value)
                      }
                      className={
                        errors.preferredTime
                          ? "border-destructive"
                          : "border-border/50 bg-secondary/30"
                      }
                    />
                    {errors.preferredTime && (
                      <p className="text-sm text-destructive">
                        {errors.preferredTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Photo Notes */}
                <div className="space-y-2">
                  <Label htmlFor="photoNotes">
                    📷 Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="photoNotes"
                    placeholder="Any additional information, visible damage, or special requests"
                    value={formData.photoNotes}
                    onChange={(e) => handleChange("photoNotes", e.target.value)}
                    className="border-border/50 bg-secondary/30"
                    rows={3}
                  />
                </div>

                {/* Error Alert */}
                {createBooking.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to submit booking. Please try again or contact us
                      directly.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  data-ocid="booking.submit_button"
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Repair Entry...
                    </>
                  ) : (
                    "✅ Save Repair"
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
