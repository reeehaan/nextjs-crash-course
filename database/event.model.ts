import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventMode = "online" | "offline" | "hybrid";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Converts a title to a URL-safe slug, e.g. "React Summit 2026" → "react-summit-2026" */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // strip non-word chars (keeps letters, digits, hyphens)
    .replace(/[\s_]+/g, "-")    // collapse whitespace / underscores into a single hyphen
    .replace(/--+/g, "-")       // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");   // trim leading / trailing hyphens
}

/**
 * Normalises a date string to ISO-8601 (YYYY-MM-DD).
 * Handles range formats such as "June 13-14, 2026" by using the start date only.
 */
function toISODate(raw: string): string {
  // "June 13-14, 2026" → "June 13, 2026" before parsing
  const stripped = raw.replace(/(\d+)-\d+/, "$1");
  const parsed = new Date(stripped);

  if (isNaN(parsed.getTime())) {
    throw new Error(
      `Invalid date "${raw}". Use a parseable format such as "June 13, 2026" or "June 13-14, 2026".`
    );
  }

  return parsed.toISOString().split("T")[0]; // YYYY-MM-DD
}

/** Normalises time to a trimmed, consistently spaced string, e.g. "9:00 AM - 6:00 PM" */
function normalizeTime(raw: string): string {
  // Collapse multiple spaces and trim surrounding whitespace.
  return raw.trim().replace(/\s{2,}/g, " ");
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const eventSchema = new Schema<IEvent>(
  {
    title:       { type: String, required: [true, "Title is required"],       trim: true },
    // slug is auto-generated; not required in input but always present after save
    slug:        { type: String, unique: true, index: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    overview:    { type: String, required: [true, "Overview is required"],    trim: true },
    image:       { type: String, required: [true, "Image URL is required"],   trim: true },
    venue:       { type: String, required: [true, "Venue is required"],       trim: true },
    location:    { type: String, required: [true, "Location is required"],    trim: true },
    date:        { type: String, required: [true, "Date is required"] },
    time:        { type: String, required: [true, "Time is required"] },
    mode:        {
      type:     String,
      required: [true, "Mode is required"],
      enum:     {
        values:  ["online", "offline", "hybrid"],
        message: 'Mode must be "online", "offline", or "hybrid".',
      },
    },
    audience:    { type: String,   required: [true, "Audience is required"],  trim: true },
    agenda:      { type: [String], required: [true, "Agenda is required"] },
    organizer:   { type: String,   required: [true, "Organizer is required"], trim: true },
    tags:        { type: [String], required: [true, "Tags are required"] },
  },
  { timestamps: true }
);

// ─── Pre-save hook ────────────────────────────────────────────────────────────

// Using a plain function (not async + no next param) lets us `throw` directly.
// Mongoose 6+ catches synchronous throws in pre-hooks and forwards them as errors.
eventSchema.pre("save", function () {
  // Re-generate slug only when the title is new or has been modified.
  if (this.isNew || this.isModified("title")) {
    this.slug = toSlug(this.title);
  }

  // Always normalise date and time so stored values are consistent regardless
  // of how they were supplied (e.g. "June 13-14, 2026" → "2026-06-13").
  this.date = toISODate(this.date); // throws on unparseable input
  this.time = normalizeTime(this.time);
});

// ─── Model ────────────────────────────────────────────────────────────────────

// Guard against "Cannot overwrite model once compiled" errors during hot-reloads.
export const EventModel: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ??
  mongoose.model<IEvent>("Event", eventSchema);
