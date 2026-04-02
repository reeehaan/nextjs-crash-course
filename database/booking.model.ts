import mongoose, { Document, Model, Schema, Types } from "mongoose";

import { EventModel } from "./event.model";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const bookingSchema = new Schema<IBooking>(
  {
    // Indexed for fast lookups of all bookings belonging to a given events.
    eventId: {
      type:     Schema.Types.ObjectId,
      ref:      "Event",
      required: [true, "eventId is required"],
      index:    true,
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      trim:     true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
  },
  { timestamps: true }
);

// ─── Pre-save hook ────────────────────────────────────────────────────────────

/**
 * Verify that the referenced Event exists before persisting a booking.
 * Using `exists()` is more efficient than `findById()` — it only checks for
 * the presence of an `_id` without fetching the full document.
 */
// Omitting `next` from async pre-hooks avoids Mongoose's overload ambiguity.
// Throwing (or returning a rejected promise) achieves the same result.
bookingSchema.pre("save", async function () {
  const eventExists = await EventModel.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(`No event found with id "${this.eventId.toString()}".`);
  }
});

// ─── Model ────────────────────────────────────────────────────────────────────

// Guard against "Cannot overwrite model once compiled" errors during hot-reloads.
export const BookingModel: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ??
  mongoose.model<IBooking>("Booking", bookingSchema);
