export interface EventItem {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 13-14, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Next.js Conf",
    image: "/images/event2.png",
    slug: "nextjs-conf",
    location: "San Francisco, CA",
    date: "October 24, 2026",
    time: "10:00 AM - 5:00 PM",
  },
  {
    title: "GitHub Universe",
    image: "/images/event3.png",
    slug: "github-universe",
    location: "San Francisco, CA",
    date: "November 11-12, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Google I/O Extended",
    image: "/images/event4.png",
    slug: "google-io-extended",
    location: "Mountain View, CA",
    date: "May 14-15, 2026",
    time: "10:00 AM - 7:00 PM",
  },
  {
    title: "ETHGlobal Hackathon",
    image: "/images/event5.png",
    slug: "ethglobal-hackathon",
    location: "Brussels, Belgium",
    date: "July 18-20, 2026",
    time: "8:00 AM - 10:00 PM",
  },
  {
    title: "AWS re:Invent",
    image: "/images/event6.png",
    slug: "aws-reinvent",
    location: "Las Vegas, NV",
    date: "December 1-5, 2026",
    time: "8:00 AM - 8:00 PM",
  },
];