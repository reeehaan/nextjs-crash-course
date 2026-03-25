'use client';
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import posthog from 'posthog-js';

interface Props {
    title: string
    image: string
}

const EventCard = ({title, image} : Props) => {
    const handleClick = () => {
        posthog.capture('event_card_clicked', { event_title: title });
    };

    return (
      <Link href={`/events}`} id="event-card" onClick={handleClick}>
        <Image src={image} alt={title} width={400} height={300} className="poster" />
          <p className="title">{title}</p>
      </Link>
    )
}
export default EventCard
