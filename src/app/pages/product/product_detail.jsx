"use client"
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Collapsible from 'react-collapsible';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import styles from '@/app/css/product_detail.module.scss';
import { useShoppingBag } from '@/app/contexts/shopping_bag_context';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination'; // Import Swiper pagination CSS
import { Mousewheel, Pagination } from 'swiper/modules';
import Link from 'next/link';
import { usePageColor } from '@/app/contexts/page_color_context';

const ProductDetail = ({ product }) => {
  const { addToBag } = useShoppingBag();
  const [openSection, setOpenSection] = useState(null);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { setColors } = usePageColor();
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setColors({ text: 'var(--shop-primary-color)', background: 'var(--shop-secondary-color)' });

    return () => setColors({ text: 'defaultTextColor', background: 'defaultBackgroundColor' });
  }, [setColors]);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth >= 1024);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAddToBag = () => {
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

  const handleCheckout = () => {
    router.push('/pages/checkout');
  };

  const handleTriggerClick = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <div className={styles.background}></div>
      <main className={styles.main_container}>
        <section className={styles.product} style={{ position: 'relative' }}>
          <Swiper
            style={{
              "--swiper-pagination-color": "red",
              "--swiper-pagination-bullet-inactive-color": "rgba(255,0,0,0.3)",
              "--swiper-pagination-bullet-inactive-opacity": "1",
              "--swiper-pagination-bullet-size": "14px",
              "--swiper-pagination-bullet-horizontal-gap": "6px"
            }}
            modules={[Pagination, Mousewheel]}
            mousewheel={true}
            pagination={{ clickable: true }}
            direction={isVertical ? 'vertical' : 'horizontal'}
            className={styles.container_1_1}
          >
            <SwiperSlide className={styles.slide_container}>
              <Zoom>
                <Image
                  alt="Product Front"
                  src={product.productFrontImage.url}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 400px"
                  style={{ objectFit: 'cover', width: '110%', height: 'auto' }}
                  
                  priority={true}
                />
              </Zoom>
            </SwiperSlide>
            <SwiperSlide>
              <Zoom>
                <Image
                  alt="Product Back"
                  src={product.productBackImage.url}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 400px"
                  style={{ objectFit: 'cover', width: '110%', height: 'auto' }}
                  loading="lazy"
                />
              </Zoom>
            </SwiperSlide>
            {product.productModelImage && (
              <SwiperSlide>
                <Zoom>
                  <Image
                    alt="Product Model"
                    src={product.productModelImage.url}
                    width={600}
                    height={600}
                    sizes="(max-width: 768px) 400px"
                    style={{ objectFit: 'cover', width: '110%', height: 'auto' }}
                    loading="lazy"
                  />
                </Zoom>
              </SwiperSlide>
            )}
          </Swiper>
          <section className={styles.product_description}>
            <section className={styles.container_1}>
              <div className={styles.back_to_shop}>
                <Link className={styles.shop_link} href='/pages/shop'>
                  <button className={styles.animated_button}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_2} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
                    <span className={styles.text}>back to shop</span>
                    <span className={styles.circle}></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.arr_1} width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H6M12 5l-7 7 7 7" /></svg>
                  </button>
                </Link>
              </div>
              <div className={styles.container_1_2}>
                <div className={styles.container_1_2_2}>
                  <h2>{product.category} - {product.paintCombo}</h2>
                  <h3 className={styles.product_price}>{product.price} DKK</h3>
                </div>
                <div className={styles.container_1_2_3}>
                  <h4 className={styles.product_color}>{product.color}</h4>
                  <h4 className={styles.product_size}>size: {product.size}</h4>
                </div>
              </div>
              {message && <div className={styles.message}><span>{message}</span></div>}
              <section className={styles.info_container}>
                <section className={styles.container_3}>
                  <Collapsible
                    className={styles.triggers}
                    trigger="Product details"
                    triggerStyle={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
                    contentContainerTagName="article"
                    transitionTime={300}
                    easing="ease-in-out"
                    open={openSection === 'productDetails'}
                    handleTriggerClick={() => handleTriggerClick('productDetails')}
                    classParentString={styles.MyCollapsible}
                  >
                    <p className={styles.product_detail}>{product.productDetail}</p>
                  </Collapsible>
                  <Collapsible
                    className={styles.triggers}
                    trigger="Shipping"
                    triggerStyle={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
                    contentContainerTagName="article"
                    transitionTime={300}
                    easing="ease-in-out"
                    open={openSection === 'shipping'}
                    handleTriggerClick={() => handleTriggerClick('shipping')}
                    classParentString={styles.MyCollapsible}
                  >
                    <p className={styles.product_detail}>
                      The delivery charge is DKK 60. Free Shipping on orders over DKK 750.
                      Delivery within 4-6 working days
                    </p>
                  </Collapsible>
                  <Collapsible
                    className={styles.triggers}
                    trigger="Care instructions"
                    triggerStyle={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
                    contentContainerTagName="article"
                    transitionTime={300}
                    easing="ease-in-out"
                    open={openSection === 'careInstructions'}
                    handleTriggerClick={() => handleTriggerClick('careInstructions')}
                    classParentString={styles.MyCollapsible}
                  >
                    <p className={styles.product_detail}>
                      Machine wash up to 40 degrees, gentle cycle, Do not Dry Clean,
                      Suitable for tumble-drying.
                    </p>
                  </Collapsible>
                </section>
              </section>
            </section>
            <section className={styles.container_2}>
              <button className={styles.container_2_1} onClick={handleAddToBag}><span>ADD TO BAG</span></button>
              <button className={styles.container_2_2} onClick={handleCheckout}><span>CHECKOUT</span></button>
            </section>
          </section>
        </section>
      </main>
    </>
  );
};

export default ProductDetail;
