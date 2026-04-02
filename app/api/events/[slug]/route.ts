import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { EventModel, IEvent } from "@/database/event.model";

// Matches slugs like "react-summit-2026" — lowercase alphanumeric words joined by hyphens.
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * GET /api/events/[slug]
 * Returns a single events document matching the given slug.
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { slug } = await params;

  // ── 1. Validate slug ──────────────────────────────────────────────────────
  if (!slug || typeof slug !== "string" || !SLUG_REGEX.test(slug)) {
    return NextResponse.json(
      { message: "Invalid or missing slug. Slugs must be lowercase alphanumeric words separated by hyphens (e.g. react-summit-2026)." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // ── 2. Query DB ────────────────────────────────────────────────────────
    const event: IEvent | null = await EventModel.findOne({ slug }).lean();

    // ── 3. Not found ───────────────────────────────────────────────────────
    if (!event) {
      return NextResponse.json(
        { message: `No event found with slug "${slug}".` },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    // ── 4. Mongoose validation error ───────────────────────────────────────
    if (err instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: "Validation error.", errors: err.errors },
        { status: 422 }
      );
    }

    // ── 5. Unexpected server error ─────────────────────────────────────────
    console.error("[GET /api/events/[slug]]", err);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching the events." },
      { status: 500 }
    );
  }
}
