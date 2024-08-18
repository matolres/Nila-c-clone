"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";  // Import the Script component
import Image from "next/image";
import styles from "@/app/page.module.scss";
import GSAPAnimation from "@/app/components/Text-reveal-animation";
import { usePageColor } from '@/app/contexts/page_color_context';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Scrollbar, Navigation } from 'swiper/modules';
import { useShoppingBag } from '@/app/contexts/shopping_bag_context';
import Link from 'next/link';
import Products from '@/app/components/products';

export default function LandingPageContent({ products, paintCombination, models, color }) {
  const { setColors } = usePageColor();
  const { addToBag } = useShoppingBag();
  const [message, setMessage] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    setColors({ text: 'var(--landing-primary-color)', background: 'var(--landing-secondary-color)' });

    return () => setColors({ text: 'defaultTextColor', background: 'defaultBackgroundColor' });
  }, [setColors]);

  const handleAddToBag = (product) => {
    const result = addToBag(product);
    if (result.status === 'added') {
      setMessage('Product added to the bag.');
    } else if (result.status === 'exists') {
      setMessage('Product is already in the bag.');
    }

    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const handleScrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const smallModelPics = models.filter(pic => pic.number === 1 || pic.number === 2);
  const bigModelPic = models.find(pic => pic.number === 3);

  return (
    <>

      <Script
        id="mcjs"
        strategy="afterInteractive"
        src="https://chimpstatic.com/mcjs-connected/js/users/d5db12d528f864f72d31a2cd8/37837a798e90e99f2f6cd6df8.js"
      />

      <main className={styles.main_container}>
        <div className={styles.background}></div>
        {message && <div className={styles.message}><span>{message}</span></div>}

        <div className={styles.splash}>
          <video
            className={styles.video}
            autoPlay
            loop
            muted
            playsInline
            objectfit="cover"
          >
            <source src="/dummy/splash.mp4" type="video/mp4" />
          </video>
          <div></div>
          <GSAPAnimation targetSelector=".hero_headline" additionalOptions={{ delay: 0.5, start: "top-=300 center", }} />
          <div className={styles.hero_headline_container}>
            <div className={styles.hero_element_container}>
              <h1 className="hero_headline">WEAR WHAT YOU ARE</h1>
            </div>
            <div className={styles.hero_element_container}>
              <Link href='/pages/shop'><button className="hero_headline"> SEE SHOP </button></Link>
            </div>
            <div className={styles.hero_element_container} onClick={handleScrollToSection}>
              <svg xmlns="http://www.w3.org/2000/svg" className="hero_headline" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#FFFF00" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"><path d="M12 5v13M5 12l7 7 7-7"/></svg>
            </div>
          </div>
        </div>

        <section ref={sectionRef} className={styles.container_1}>
          <section className={styles.container_1_1}>
            <div className={styles.container_span_1}>
              <GSAPAnimation targetSelector=".text_container_1" />
              <div className={styles.anim_container}>
                <span className="text_container_1">EACH PIECE IS</span>
              </div>
              <div className={styles.anim_container}>
                <span className="text_container_1">HANDPAINTED</span>
              </div>
            </div>
            <p>
              ELEVATE YOUR STYLE: UNIQUE HAND-PAINTED CLOTHING AS ABSTRACT ART.
              <br />
              <br />
              DISCOVER A WORLD WHERE FASHION MEETS INDIVIDUALITY. EACH GARMENT IS METICULOUSLY CRAFTED, ENSURING ITS STATUS AS A TRUE ORIGINAL – A RARE GEM IN A WORLD OF MASS PRODUCTION.
              <br />
              <br />
              MAKE A BOLD STATEMENT WITH CLOTHING THAT IS AS UNIQUE AS YOU ARE. WELCOME TO A REALM WHERE FASHION BECOMES A CANVAS AND EVERY PIECE TELLS A STORY.
            </p>
          </section>
        </section>

        <section className={styles.container_1_2}>
          <div className={styles.paint_comb_container}>
            <h1>PAINT COMBINATIONS</h1>
            <div className={styles.paint_combo_text_container}>
              <p className={styles.paint_combo_text}>
                EACH PIECE IS FEATURING ONE OF THE FOUR DISTINCTIVE COLOR COMBINATIONS SEEN BELOW, TO ENSURE THAT EVERY PIECE IS TRULY ONE-OF-A-KIND.
              </p>
            </div>
            <div className={styles.scrolling_wrapper}>
              <div className={styles.prev_button_container}>
                <div className={`${styles.customPrev} custom-prev-paint`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_1} width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round">
                    <path d="M19 12H6M12 5l-7 7 7 7" />
                  </svg>
                </div>
              </div>
              <div className={styles.next_button_container}>
                <div className={`${styles.customNext} custom-next-paint`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_2} width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round">
                    <path d="M5 12h13M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <Swiper
                modules={[Scrollbar, Navigation]}
                navigation={{
                  nextEl: '.custom-next-paint',
                  prevEl: '.custom-prev-paint',
                }}
                scrollbar={{ hide: true }}
                spaceBetween={1}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 20 },
                  768: { slidesPerView: 2, spaceBetween: 40 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {paintCombination.map(paint => (
                  <SwiperSlide key={paint.id}>
                    <div className={styles.card_2}>
                      <div className={styles.image}>
                        <Image
                          className={styles.img}
                          alt={paint.name}
                          src={paint.colorCombo.url}
                          width={400}
                          height={400}
                        />
                        <h3 className={styles.paint_name}>{paint.name}</h3>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className={styles.paint_comb_container}>
            <h1>LATEST RELEASES</h1>
            <p></p>
            <div className={styles.scrolling_wrapper}>
              <div className={styles.prev_button_container}>
                <div className={`${styles.customPrev} custom-prev-releases` }>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_1} width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
                </div>
              </div>
              <div className={styles.next_button_container}>
                <div className={`${styles.customNext} custom-next-releases` }>
                  <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_2} width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7" /></svg>
                </div>
              </div>

              <Swiper
                modules={[Scrollbar, Navigation]}
                navigation={{
                  nextEl: '.custom-next-releases',
                  prevEl: '.custom-prev-releases',
                }}
                scrollbar={{ hide: true }}
                spaceBetween={1}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 0 },
                  768: { slidesPerView: 2, spaceBetween: 40 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                }}
              >
                {products.map(product => (
                  <SwiperSlide key={product.id}>
                    <div className={styles.card_2}>
                      <div className={styles.image_2}>
                        <Products color="blue" className={styles.product} product={product}  key={product.id}/>
                        <div className={styles.hover_container}>
                          <button className={styles.button} onClick={() => handleAddToBag(product)}>QUICK ADD</button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        <section className={styles.container_1_4}>
          <GSAPAnimation targetSelector=".text_container_2" additionalOptions={{ stagger:0.03 }} />
          <div className={styles.container_span}>
            <div className={styles.span}>
              <span className="text_container_2">BRINGING MODERN ART <br /></span>
            </div>
            <div className={styles.span}>
              <span className="text_container_2"> AND CLOTHING TOGETHER.</span>
            </div>
            <div className={styles.span}>
              <span className="text_container_2">DARE TO BE</span>
              <span className="text_container_2"><h1 className={styles.last_word}>UNIQUE.</h1></span>
            </div>
          </div>
        </section>

        <section className={styles.container_1_5}>
          <div className={styles.models_container}>
            <div className={styles.small_model_pics}>
              {smallModelPics.map(pic => (
                <Link href='/pages/lookbook' key={pic.number}>
                  <Image key={pic.number} src={pic.model.url} alt="model picture" width={300} height={300} style={{ objectFit: 'cover' }} />
                </Link>
              ))}
            </div>
            <div className={styles.big_model_pics}>
              {bigModelPic && (
                <Link href='/pages/lookbook'>
                  <Image className={styles.big_model} src={bigModelPic.model.url} alt="model picture" width={300} height={600} style={{ objectFit: 'cover' }} />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
