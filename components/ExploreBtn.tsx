'use client';
import React from 'react'
import Image from "next/image";

const ExploreBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={ ()=> console.log("CLICKED")
        }>
            <a href="#events">
                Explore Button</a>
            <Image src="/icons/arrow-down.svg" alt="Explore Button" height={24} width={24}/>
        </button>
    )
}
export default ExploreBtn
