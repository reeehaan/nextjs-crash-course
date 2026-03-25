'use client';
import React from 'react'
import Image from "next/image";
import posthog from 'posthog-js';

const ExploreBtn = () => {
    const handleClick = () => {
        console.log("CLICKED");
        posthog.capture('explore_clicked');
    };

    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleClick}>
            <a href="#events">
                Explore Button</a>
            <Image src="/icons/arrow-down.svg" alt="Explore Button" height={24} width={24}/>
        </button>
    )
}
export default ExploreBtn
