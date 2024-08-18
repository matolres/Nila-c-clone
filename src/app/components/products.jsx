
import Image from "next/image";
import styles from "@/app/css/shop_product.module.scss";
import Link from "next/link";

const Products = ({ product, color }) => {


  return (
    <div className={styles.product_container}>
      <Link href={`/pages/product/${product.id}`} key={product.id} className={styles.product_link}>

          <Image src={product.productFrontImage.url} alt={`${product.color} ${product.category} ${product.paintCombo}`} height="200" width="200" style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
          <div className={styles.color_price}>
            <h3 className="type" style={{color:color}}>{product.category} - {product.paintCombo}</h3>
            <p style={{color:color}}>{product.color}</p>
            <p style={{color:color}}>DKK {product.price}</p>
            <p style={{color:color}}>size: {product.size}</p>
          </div>
        
      </Link>
    </div>
  );
};

export default Products;

/*
  const [imageSrc, setImageSrc] = useState(product.productFrontImage.url);

  const handleMouseEnter = () => {
    setImageSrc(product.productBackImage.url);
  };

  const handleMouseLeave = () => {
    setImageSrc(product.productFrontImage.url);
  };


          <div
          className="product_image_front"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        </div>
  
*/