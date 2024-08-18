import LandingPageContent from "./pages/landing_page/landing_page_content";
import styles from "./page.module.scss";
import Menu from "./components/menu";
import Footer from "./components/footer";
import { performRequest } from "./lib/datocms";


const query = `
query {
  allPaintCombinations {
    colorCombo {
      url
    }
    id
    name
  }
  allModelPics {
    number
    model {
      url
    }
  }
  allProducts(filter: { latest: { eq: true } }) {
    id
    productFrontImage {
      url
    }
    category
    color
    paintCombo
    price
    productDetail
    size
  }
}
`;

export default async function Home() {
  const { data } = await performRequest({ query: query });
  const allProducts = data.allProducts;
  const allPaintCombinations = data.allPaintCombinations;
  const allModelPics = data.allModelPics;
  
  console.log("fetched model pics :", allModelPics);
  console.log("Fetched ALLPRODUCTS in Shop component:", allProducts);
  console.log("Fetched data in Shop component:", allPaintCombinations);
  
  return (
    <>

      
      <Menu className={styles.menu} primary="yellow" secondary="blue" />
      <LandingPageContent products={allProducts} paintCombination={allPaintCombinations} models={allModelPics} />
      <Footer />
    </>
  );
}
