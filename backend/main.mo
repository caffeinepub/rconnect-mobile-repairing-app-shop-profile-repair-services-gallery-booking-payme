import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
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
  let conciseBooleanData = true : Bool; // fallback for buggy fields from Safari browsers

  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let reviews = List.empty<Review>();

  // USER PROFILE MANAGEMENT
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  // BOOKING MANAGEMENT
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
    // Open to all users including guests - publicly accessible per implementation plan
    bookings.values().toArray().sort(Booking.compareByTimestamp);
  };

  // Add new query for phone number based bookings
  public query ({ caller }) func getBookingsByPhoneNumber(phoneNumber : Text) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve booking history by phone number");
    };

    let filteredBookings : List.List<Booking> = List.empty<Booking>();

    for ((_, booking) in bookings.entries()) {
      if (booking.phoneNumber == phoneNumber) {
        filteredBookings.add(booking);
      };
    };

    filteredBookings.toArray();
  };

  // REVIEW MANAGEMENT
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

  // PUBLIC BOOKING TRACKING
  // Customers can track their booking by providing booking ID and phone number for verification
  public query ({ caller }) func trackBooking(bookingId : Nat, phoneNumber : Text) : async Booking {
    // Open to all users including guests - but requires phone number verification
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Verify the phone number matches to prevent unauthorized access
        if (booking.phoneNumber != phoneNumber) {
          Runtime.trap("Unauthorized: Phone number does not match booking");
        };
        booking;
      };
    };
  };
};
