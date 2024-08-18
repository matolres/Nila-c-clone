'use client'
import { useEffect } from "react";
import Image from "next/image";
import styles from '@/app/css/lookbook.module.scss';
import { usePageColor } from "../../contexts/page_color_context";

export default function LookbookContent({ lookbook }) {
    const { setColors } = usePageColor();

    useEffect(() => {
      setColors({ text: 'var(--lookbook-primary-color)', background: 'var(--lookbook-secondary-color)' });
  
        return () => setColors({ text: 'defaultTextColor', background: 'defaultBackgroundColor' });
    }, [setColors]);
  return (
    <>
      <div className={styles.background}></div>
      <main className={styles.main_container}>
        <div className={styles.headlines}>
          <h1>LOOKBOOK</h1>
          <h2>{lookbook.season} - {lookbook.year}</h2>
        </div >
        <div className={styles.images_background}>
        <div className={styles.images_container}>
          {lookbook.gallery.map((image) => (
            <div className={styles.image_container} key={image.url}>
              <Image
                alt={image.title}
                src={image.url}
                layout="responsive"
                objectFit="cover"
                height={300}
                width={300}
              />
              <h4 className={styles.image_title}>{image.title}</h4>
            </div>
          ))}
        </div>
        </div>
      </main>
    </>
  );
}
