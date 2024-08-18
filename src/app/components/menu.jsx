"use client";
import styles from "@/app/css/menu.module.scss";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ShoppingBag from "./shopping-bag";
import GSAPAnimation from "./Text-reveal-animation";
import { useShoppingBag } from "@/app/contexts/shopping_bag_context";

export default function Menu({ primary, secondary }) {
    const { bagCount } = useShoppingBag();
    const [isOpen, setIsOpen] = useState(false);
    const [isShoppingBagOpen, setShoppingBagOpen] = useState(false);
    const [shouldRenderShoppingBag, setShouldRenderShoppingBag] = useState(false);
    const shoppingBagRef = useRef(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const handleShoppingBagClick = () => {
        if (!isShoppingBagOpen) {
            setShouldRenderShoppingBag(true);
            gsap.fromTo(shoppingBagRef.current, { x: '-65%' }, { x: '0', duration: 0.5, ease: "power2.out" });
            setOverlayVisible(true);
            gsap.to(`.${styles.background_overlay}`, {
              opacity: 0.5,
              duration: 0.005,
              ease: 'power2.inOut',
            });
        } else {
            gsap.fromTo(shoppingBagRef.current, { x: '0' }, {
                x: '-65%',
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => setShouldRenderShoppingBag(false)
            });
            gsap.to(`.${styles.background_overlay}`, {
                opacity: 0,
                duration: 0.05,
                ease: 'power2.inOut',
                onComplete: () => setOverlayVisible(false),
              });
        }
        setShoppingBagOpen(!isShoppingBagOpen);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useGSAP(() => {
        if (document.querySelector(".fullsize")) {
            if (isOpen) {
                gsap.from(".item-text", {
                    y: 150,
                    stagger: 0.05,
                    delay: 0.6,
                    duration: 0.3,
                    ease: "circ.out",
                });
                gsap.to(".item-text", {
                    y: 10,
                    stagger: 0.05,
                    delay: 0.7,
                    duration: 0.2,
                    ease: "circ.out",
                });

                gsap.to(".moveMe", {
                    duration: 0.3,
                    height: "100vh",
                    ease: "sine.inOut",
                });

                gsap.to(".fullsize", {
                    duration: 0.3,
                    height: "100vh",
                    ease: "sine.inOut",
                });
            } else {
                gsap.from(".item-text", {
                    y: 10,
                    stagger: 0.05,
                    delay: 0.2,
                    duration: 0.6,
                    ease: "circ.out",
                });
                gsap.to(".item-text", {
                    y: 120,
                    stagger: 0.05,
                    delay: 0.2,
                    duration: 0.6,
                    ease: "circ.out",
                });

                gsap.to(".moveMe", {
                    delay: 0.5,
                    duration: 0.3,
                    height: "0",
                    ease: "sine.inOut",
                });
                gsap.to(".fullsize", {
                    delay: 0.5,
                    duration: 0.3,
                    height: "62",
                    ease: "sine.inOut",
                });
            }
        }
    }, [isOpen]);

    return (
        <>
            <header className={styles.menu_header} style={{ '--desktop-item-primary': primary, '--desktop-item-secondary': secondary }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="62" className={`fullsize ${styles.menu_anim} ${styles.front}`} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <clipPath id="theClipPath">
                            <rect className="moveMe" width="100%" style={{ fill: secondary }} y="0%" x="0"></rect>
                        </clipPath>
                    </defs>
                    <rect className={`moveMe ${styles.rect_background}`} width="100%" style={{ fill: primary }} y="0%" x="0"></rect>
                    <Link rel="stylesheet" href="/">
                        <text className={styles.logo} x="16" y="40" fontSize="25" style={{ fill: primary }}>NILA-C</text>
                    </Link>

                    <g clipPath="url(#theClipPath)" width="100%">
                        <Link rel="stylesheet" href="/">
                            <text className={styles.logo_overlay} x="16" y="40" fontSize="25" style={{ fill: secondary }}>NILA-C</text>
                        </Link>

                    </g>
                    <text
                        className={styles.menu_icon}
                        onClick={() => toggleOpen()}
                        x="100%"
                        dx="-16"
                        y="38"
                        textAnchor="end"
                        fontSize="15"
                        style={{ fill: primary }}
                    >
                        MENU
                    </text>
                    <svg className={styles.cart_icon} onClick={handleShoppingBagClick} x="125px" y="16" height="25" width="25" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill='none' stroke={primary}  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path  d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0"/></svg>
                    <g clipPath="url(#theClipPath)">
                        <text
                            className={styles.closing_menu_icon}
                            onClick={() => toggleOpen()}
                            x="100%"
                            dx="-16"
                            y="38"
                            textAnchor="end"
                            fontSize="15"
                            style={{ fill: secondary}}
                        >
                            CLOSE
                        </text>
                        
                    </g>
                </svg>
                
                {bagCount >= 0 && (
                    <span className={styles.bag_count} style={{ color: primary}}>
                        ( {bagCount} )
                    </span>
                )}
                
                 <div ref={shoppingBagRef} className={styles.shopping_bag_wrapper}>
                    {shouldRenderShoppingBag && <ShoppingBag handleShoppingBagClick={handleShoppingBagClick} />}
                </div>
                <div className={`${styles.background_overlay} ${overlayVisible ? styles.visible_overlay : ''}`} style={{ backgroundColor: secondary }}></div>

                <div className={`${styles.items_container} ${isOpen ? styles.animate_menu : styles.animate_menu_up}`}>
                    <ul className={styles.items}>
                        <GSAPAnimation targetSelector=".item-text" />
                        <Link className={styles.link} href='/pages/shop'><li className={`${styles.item} item-text`} style={{ color: secondary }}>SHOP</li></Link>
                        <Link href='/pages/lookbook'><li className={`${styles.item} item-text`} style={{ color: secondary }}>LOOKBOOK</li></Link>
                        <Link href='/pages/about'><li className={`${styles.item} item-text`} style={{ color: secondary }}>ABOUT</li></Link>
                        <Link href='/pages/contact'><li className={`${styles.item} item-text`} style={{ color: secondary }}>CONTACT</li></Link>
                    </ul>
                </div>
            </header>
            <div className={styles.desktop_menu_container} style={{ '--desktop-item-primary': primary }}>
                <div className={styles.desktop_menu_container} style={{ '--desktop-item-secondary': secondary }}>
                    <ul className={styles.menu_items_desktop}>
                        
                            <li className={styles.item_desktop} style={{ color: primary }}>
                            <Link href='/pages/shop' className={styles.link}>
                                <span className={styles.item_text}>SHOP</span>
                                <span className={styles.overlay}>SHOP</span>
                            </Link>
                            </li>
                        
                        
                            <li className={styles.item_desktop} style={{ color: primary }}>
                            <Link href='/pages/lookbook' className={styles.link}>
                                <span className={styles.item_text}>LOOKBOOK</span>
                                <span className={styles.overlay}>LOOKBOOK</span>
                            </Link>
                            </li>
                        
                        
                            <li className={styles.item_desktop} style={{ color: primary }}>
                            <Link href='/pages/about' className={styles.link}>
                                <span className={styles.item_text}>ABOUT</span>
                                <span className={styles.overlay}>ABOUT</span>
                            </Link>
                            </li>
                        
                       
                            <li className={styles.item_desktop} style={{ color: primary }}>
                            <Link href='/pages/contact' className={styles.link}>
                                <span className={styles.item_text}>CONTACT</span>
                                <span className={styles.overlay}>CONTACT</span>
                            </Link>
                            </li>
                        
                    </ul>
                </div>
            </div>
        </>
    );
}



/* 

 <div className={`${styles.background_overlay} ${overlayVisible ? styles.visible_overlay : ''}`} style={{ backgroundColor: secondary }}></div>

                <div className={`${styles.items_container} ${isOpen ? styles.animate_menu : styles.animate_menu_up}`}>
                    <ul className={styles.items}>
                        <GSAPAnimation targetSelector=".item-text" />
                        <Link className={styles.link} href='/pages/shop'><li className={`${styles.item} item-text`} style={{ color: secondary }}>SHOP</li></Link>
                        <Link href='/pages/lookbook'><li className={`${styles.item} item-text`} style={{ color: secondary }}>LOOKBOOK</li></Link>
                        <Link href='/pages/about'><li className={`${styles.item} item-text`} style={{ color: secondary }}>ABOUT</li></Link>
                        <Link href='/pages/contact'><li className={`${styles.item} item-text`} style={{ color: secondary }}>CONTACT</li></Link>
                    </ul>
                </div>
            </header>
            <div className={styles.desktop_menu_container} style={{ '--desktop-item-primary': primary }}>
                <div className={styles.desktop_menu_container} style={{ '--desktop-item-secondary': secondary }}>
                    <ul className={styles.menu_items_desktop}>
                        <Link href='/pages/shop' className={styles.link}>
                            <li className={styles.item_desktop} style={{ color: primary }}>
                                <span className={styles.item_text}>SHOP</span>
                                <span className={styles.overlay}>SHOP</span>
                            </li>
                        </Link>
                        <Link href='/pages/lookbook' className={styles.link}>
                            <li className={styles.item_desktop} style={{ color: primary }}>
                                <span className={styles.item_text}>LOOKBOOK</span>
                                <span className={styles.overlay}>LOOKBOOK</span>
                            </li>
                        </Link>
                        <Link href='/pages/about' className={styles.link}>
                            <li className={styles.item_desktop} style={{ color: primary }}>
                                <span className={styles.item_text}>ABOUT</span>
                                <span className={styles.overlay}>ABOUT</span>
                            </li>
                        </Link>
                        <Link href='/pages/contact' className={styles.link}>
                            <li className={styles.item_desktop} style={{ color: primary }}>
                                <span className={styles.item_text}>CONTACT</span>
                                <span className={styles.overlay}>CONTACT</span>
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>

*/