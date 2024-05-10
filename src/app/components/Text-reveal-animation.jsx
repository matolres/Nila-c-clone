"use client"
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function GSAPAnimation({ targetSelector, additionalOptions }) {
    gsap.registerPlugin(useGSAP);
    useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const defaultAnimationOptions = {
      y: 15,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      stagger: 0.03,
      delay: 0.2,
      duration: 0.8
    };
    const animationOptions = { ...defaultAnimationOptions, ...additionalOptions };
    gsap.from(targetSelector, {
      ...animationOptions,
      scrollTrigger: {
        trigger: targetSelector,
        toggleActions: 'restart none none none'
      },
      ease: "back.out" // You can set a default ease or override it with props
    });
    gsap.context()
  });

 
}