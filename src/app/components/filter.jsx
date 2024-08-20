"use client"
import React, { useState, useEffect, useRef } from 'react';
import styles from "@/app/css/filter.module.scss";
import Collapsible from 'react-collapsible';
import gsap from 'gsap';

const filterOptions = [
  { label: 'CATEGORIES', filterType: 'categories', options: ['Hoodie', 'Jeans', 'T-shirt', 'Pants', 'Skirt'] },
  { label: 'COLORS', filterType: 'colors', options: ['Blue', 'Navy', 'White', 'Black', 'Yellow', 'Green', 'Orange', 'Purple', 'Pink', 'Grey'] },
  { label: 'PAINT COMBINATIONS', filterType: 'paintCombos', options: ['Friend', 'Uni', 'Cool', 'Ice'] },
  { label: 'SIZES', filterType: 'sizes', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'] }
];

const FilterOptions = ({ products, setFilteredProducts, isFilterVisible, toggleFilterVisibility }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    colors: [],
    paintCombos: [],
    sizes: []
  });
  const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      const translateXValue = window.innerWidth > 768 ? '0%' : '0%';
      gsap.to(filterRef.current, {
        x: isFilterVisible ? translateXValue : '100%',
        duration: 0.5,
        ease: isFilterVisible ? 'power2.out' : 'power2.in',
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isFilterVisible]);

  useEffect(() => {
    if (isFilterVisible) {
      setOverlayVisible(true);
      gsap.to(`.${styles.op_overlay}`, {
        opacity: 0.5,
        duration: 0.005,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(`.${styles.op_overlay}`, {
        opacity: 0,
        duration: 0.005,
        ease: 'power2.inOut',
        onComplete: () => setOverlayVisible(false),
      });
    }
  }, [isFilterVisible]);

  useEffect(() => {
    let filtered = products;
    Object.keys(selectedFilters).forEach(filterType => {
      if (selectedFilters[filterType].length > 0) {
        const key = filterType === 'categories' ? 'category' : filterType.slice(0, -1);
        filtered = filtered.filter(product => selectedFilters[filterType].includes(product[key]));
      }
    });
    setFilteredProducts(filtered);
  }, [selectedFilters, products, setFilteredProducts]);

  const handleFilterChange = (filterType, value, isChecked) => {
    setTempSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: isChecked
        ? [...prevFilters[filterType], value]
        : prevFilters[filterType].filter(item => item !== value)
    }));
  };

  const handleCategoryClick = (option) => {
    setTempSelectedFilters({
      categories: [option],
      colors: [],
      paintCombos: [],
      sizes: []
    });
    setSelectedFilters({
      categories: [option],
      colors: [],
      paintCombos: [],
      sizes: []
    });
  };

  const handlePaintComboClick = (option) => {
    setTempSelectedFilters({
      categories: [],
      colors: [],
      paintCombos: [option],
      sizes: []
    });
    setSelectedFilters({
      categories: [],
      colors: [],
      paintCombos: [option],
      sizes: []
    });
  };

  const handleCategoryReset = () => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      categories: [],
      colors: [],
      paintCombos: [],
      sizes: []
    }));
    setTempSelectedFilters({
      categories: [],
      colors: [],
      paintCombos: [],
      sizes: []
    });
  };

  const applyFilters = () => {
    let filtered = products;
    Object.keys(tempSelectedFilters).forEach(filterType => {
      if (tempSelectedFilters[filterType].length > 0) {
        const key = filterType === 'categories' ? 'category' : filterType.slice(0, -1);
        filtered = filtered.filter(product => tempSelectedFilters[filterType].includes(product[key]));
      }
    });

    if (filtered.length === 0) {
      console.log("No products match the selected filters");
      return;
    }

    setSelectedFilters(tempSelectedFilters);
    toggleFilterVisibility();
    console.log("filtered products:", tempSelectedFilters);
  };

  const clearFilters = () => {
    setTempSelectedFilters({
      categories: [],
      colors: [],
      paintCombos: [],
      sizes: []
    });
  };

  const categoryOptions = filterOptions.find(option => option.filterType === 'categories')?.options || [];
  const PaintCombos = filterOptions.find(option => option.filterType === 'paintCombos')?.options || [];

  return (
    <>
      <div className={styles.category_filter}>
        <div className={styles.desktop_filter_container}>
          <div className={styles.paint_dropdown_container}>
            <span>paint combinations</span>
            <ul className={styles.dropdown}>
              {PaintCombos.map(option => (
                <li key={option} onClick={() => handlePaintComboClick(option)}>
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className={styles.category_list}>
            {categoryOptions.map(option => (
              <li key={option} onClick={() => handleCategoryClick(option)}>
                <span>{option}</span>
              </li>
            ))}
            <li><span onClick={handleCategoryReset}>all</span></li>
          </ul>
        </div>
        <span className={styles.open_filter} onClick={toggleFilterVisibility}>FILTER</span>
      </div>

      <div className={`${styles.op_overlay} ${overlayVisible ? styles.visible_overlay : ''}`}></div>
      <section className={`${styles.container} ${isFilterVisible ? styles.visible : ''}`} ref={filterRef}>
        <div className={styles.filtercontainer}>
          <span className={styles.close_filter} onClick={toggleFilterVisibility} style={{ cursor: 'pointer' }}>CLOSE</span>
          <div className={styles.options_container}>
            {filterOptions.map(({ label, filterType, options }) => (
              <div key={filterType} className={styles.filter_options}>
                <Collapsible
                  className={styles.triggers}
                  trigger={label}
                  triggerStyle={{ color: 'red', cursor: 'pointer', fontSize: '37px' }}
                  transitionTime={300}
                  easing="ease-in-out"
                  classParentString={styles.MyCollapsible}
                >
                  <form className={styles.filter_form}>
                    {options.map(option => (
                      <label key={option} className={styles.labels}>
                        <input 
                          type="checkbox"
                          value={option}
                          checked={tempSelectedFilters[filterType].includes(option)}
                          onChange={(e) =>
                            handleFilterChange(filterType, e.target.value, e.target.checked)
                          }
                        />
                        <span></span>
                        {option}
                      </label>
                    ))}
                  </form>
                </Collapsible>
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <button className={styles.clear} onClick={clearFilters}>
              CLEAR
            </button>
            <button className={styles.apply} onClick={applyFilters}>
              APPLY
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterOptions;
