import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface MakeBookingRequest {
    customerName: string;
    photoNotes?: string;
    paymentMethod: string;
    issueDescription: string;
    preferredDateTime: Time;
    phoneNumber: string;
    deviceModel: string;
}
export interface Booking {
    id: bigint;
    customerName: string;
    status: BookingStatus;
    photoNotes?: string;
    paymentMethod: string;
    issueDescription: string;
    preferredDateTime: Time;
    timestamp: Time;
    phoneNumber: string;
    deviceModel: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface Review {
    timeStamp: Time;
    reviewText: string;
    author: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPaymentInstruction(instruction: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(request: MakeBookingRequest): Promise<bigint>;
    deletePaymentInstruction(id: bigint): Promise<void>;
    getAllBookingEntries(): Promise<Array<Booking>>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllBookingsPublic(): Promise<Array<Booking>>;
    getAllPaymentInstructions(): Promise<Array<[bigint, string]>>;
    getAllReviews(): Promise<Array<Review>>;
    getBooking(bookingId: bigint): Promise<Booking>;
    getBookingPublic(bookingId: bigint): Promise<Booking>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    processPayment(bookingId: bigint, paymentMethod: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitReview(author: string, reviewText: string): Promise<void>;
    updateBookingStatus(bookingId: bigint, newStatus: BookingStatus): Promise<void>;
    updatePaymentInstruction(id: bigint, newInstruction: string): Promise<void>;
}
