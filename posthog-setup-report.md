<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js app. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with automatic exception capture (error tracking) enabled. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, improving reliability against ad blockers. Three client-side events are now tracked at the key user interaction points in the app.

| Event Name | Description | File |
|---|---|---|
| `explore_clicked` | User clicked the Explore button on the homepage hero section, indicating intent to browse events | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view details about a specific event (includes `event_title` property) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the navbar — Home, Events, or Create Event (includes `label` property) | `components/Navbar.tsx` |

**Files created/modified:**
- `instrumentation-client.ts` — PostHog client-side initialization (new)
- `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`
- `components/ExploreBtn.tsx` — Added `explore_clicked` event capture
- `components/EventCard.tsx` — Added `event_card_clicked` event capture with `event_title` property
- `components/Navbar.tsx` — Added `nav_link_clicked` event capture with `label` property

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/355935/dashboard/1396413)
- **Insight 1**: [Explore & Event Card Clicks (Daily)](https://us.posthog.com/project/355935/insights/N3gkfj5h) — Daily trend of explore and event card clicks
- **Insight 2**: [Event Card Clicks by Event Title](https://us.posthog.com/project/355935/insights/FW4scnRM) — Which specific events users click most
- **Insight 3**: [Explore to Event Card Conversion Funnel](https://us.posthog.com/project/355935/insights/n3TLag0m) — How many users who click Explore go on to click an event card
- **Insight 4**: [Nav Link Clicks by Destination](https://us.posthog.com/project/355935/insights/kPvIrDGo) — Navigation intent broken down by link label
- **Insight 5**: [Unique Users Engaging with Events](https://us.posthog.com/project/355935/insights/Kj2P1LAT) — Daily active users interacting with explore and event cards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
