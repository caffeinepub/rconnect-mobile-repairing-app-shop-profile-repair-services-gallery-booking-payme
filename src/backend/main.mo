import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  public type Booking = {
    id : Nat;
    customerName : Text;
    phoneNumber : Text;
    deviceModel : Text;
    issueDescription : Text;
    preferredDateTime : Time.Time;
    photoNotes : ?Text;
    paymentMethod : Text;
    status : BookingStatus;
    timestamp : Time.Time;
  };

  public type Review = {
    author : Text;
    reviewText : Text;
    timeStamp : Time.Time;
  };

  public type MakeBookingRequest = {
    customerName : Text;
    phoneNumber : Text;
    deviceModel : Text;
    issueDescription : Text;
    preferredDateTime : Time.Time;
    photoNotes : ?Text;
    paymentMethod : Text;
  };

  module Booking {
    public func compareByTimestamp(booking1 : Booking, booking2 : Booking) : Order.Order {
      if (booking1.timestamp < booking2.timestamp) { return #less };
      if (booking1.timestamp > booking2.timestamp) { return #greater };
      #equal;
    };
  };

  var nextBookingId = 1;
  var nextPaymentInstructionId = 1;
  let conciseBooleanData = true; // fallback for buggy fields from Safari browsers

  let bookings = Map.empty<Nat, Booking>();
  let paymentInstructions = Map.empty<Nat, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let reviews = List.empty<Review>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Booking Management
  public shared ({ caller }) func createBooking(request : MakeBookingRequest) : async Nat {
    // Open to all users including guests - customers can submit bookings without authentication
    let bookingId = nextBookingId;
    nextBookingId += 1;

    let newBooking : Booking = {
      id = bookingId;
      customerName = request.customerName;
      phoneNumber = request.phoneNumber;
      deviceModel = request.deviceModel;
      issueDescription = request.issueDescription;
      preferredDateTime = request.preferredDateTime;
      photoNotes = request.photoNotes;
      paymentMethod = request.paymentMethod;
      status = #pending;
      timestamp = Time.now();
    };

    bookings.add(bookingId, newBooking);
    bookingId;
  };

  public query ({ caller }) func getBooking(bookingId : Nat) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view booking details");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = {
          id = bookingId;
          customerName = booking.customerName;
          phoneNumber = booking.phoneNumber;
          deviceModel = booking.deviceModel;
          issueDescription = booking.issueDescription;
          preferredDateTime = booking.preferredDateTime;
          photoNotes = booking.photoNotes;
          paymentMethod = booking.paymentMethod;
          status = newStatus;
          timestamp = booking.timestamp;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getAllBookingEntries() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort(Booking.compareByTimestamp);
  };

  // Payment Instructions Management
  public shared ({ caller }) func addPaymentInstruction(instruction : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add payment instructions");
    };

    let instructionId = nextPaymentInstructionId;
    nextPaymentInstructionId += 1;
    paymentInstructions.add(instructionId, instruction);
    instructionId;
  };

  public shared ({ caller }) func updatePaymentInstruction(id : Nat, newInstruction : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment instructions");
    };

    if (not (paymentInstructions.containsKey(id))) {
      Runtime.trap("Instruction not found");
    };

    paymentInstructions.add(id, newInstruction);
  };

  public shared ({ caller }) func deletePaymentInstruction(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete payment instructions");
    };

    if (not (paymentInstructions.containsKey(id))) {
      Runtime.trap("Instruction not found");
    };

    paymentInstructions.remove(id);
  };

  public query ({ caller }) func getAllPaymentInstructions() : async [(Nat, Text)] {
    // Open to all users including guests - customers need to see payment instructions
    paymentInstructions.toArray();
  };

  public shared ({ caller }) func processPayment(bookingId : Nat, paymentMethod : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process payments");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking = {
          id = bookingId;
          customerName = booking.customerName;
          phoneNumber = booking.phoneNumber;
          deviceModel = booking.deviceModel;
          issueDescription = booking.issueDescription;
          preferredDateTime = booking.preferredDateTime;
          photoNotes = booking.photoNotes;
          paymentMethod;
          status = booking.status;
          timestamp = booking.timestamp;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // Customer Review Management
  public shared ({ caller }) func submitReview(author : Text, reviewText : Text) : async () {
    // Open to all users including guests - customers can submit reviews without authentication
    let newReview = {
      author;
      reviewText;
      timeStamp = Time.now();
    };
    reviews.add(newReview);
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    // Open to all users including guests - reviews are public
    reviews.toArray();
  };

  // Public endpoints for read-only booking list (no login required, no status updates allowed)
  public query ({ caller }) func getAllBookingsPublic() : async [Booking] {
    // Open to all users including guests - read-only view of all bookings
    bookings.values().toArray().sort(Booking.compareByTimestamp);
  };

  public query ({ caller }) func getBookingPublic(bookingId : Nat) : async Booking {
    // Open to all users including guests - read-only view of booking details
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };
};
