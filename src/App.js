import styled from "styled-components";
import React, { useEffect, useState } from "react";
function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategories.includes(selectedCategory)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== selectedCategory)
      );
    } else {
      setSelectedCategories([...selectedCategories, selectedCategory]);
    }
  };
  const filteredProducts = products
    .filter((product) => {
      if (selectedCategories.length === 0) {
        return true;
      } else {
        return selectedCategories.includes(product.category);
      }
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  const fetchProducts = async () => {
    const res = await fetch(`https://dummyjson.com/products?limit=50`);
    const data = await res.json();
    if (data && data.products) {
      setProducts(data.products);
    }
  };
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= products.length / 10 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };
  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const Card = styled.div`
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 16px;
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  const Title = styled.h3`
    color: #333;
    font-size: 20px;
    margin: 0;
  `;

  const Description = styled.p`
    color: #000;
    font-size: 16px;
  `;

  const Price = styled.p`
    color: #ff5733;
    font-size: 18px;
    font-weight: bold;
    margin-top: 8px;
  `;

  const Image = styled.img`
    width: 100%;
    height: 50%;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 16px;
    object-fit: cover;
  `;
  const Container = styled.div`
    margin: 20px;
    padding: 0;
    list-style-type: none;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr 1fr;
  `;
  const Pagination = styled.div`
    padding: 10px;
    margin: 15px 0;
    display: flex;
    justify-content: center;
    span {
      padding: 15px 20px;
      border: 1px solid gray;
      cursor: pointer;
    }
  `;

  const Selected = styled.div`
    background-color: rgb(220, 220, 220);
  `;
  const Disable = styled.div`
    opacity: 0;
  `;
  const Info = styled.label`
    margin-left: 0.4rem;
  `;
  const Main = styled.div`
    padding-top: 4rem;
    border-radius: 0.2rem;
    width: 10rem;
    label {
      display: flex;
      justify-content: start;
      padding: 0.5em;
    }
  `;
  const ContentContainer = styled.div`
    margin-left: 290px;
    padding: 25px;
  `;
  const Category = styled.div`
    padding-top: 4rem;
    label {
      display: flex;
      padding: 0.5rem;
    }
  `;
  const SidebarContainer = styled.div`
    width: 250px;
    height: 100%;
    background-color: #333;
    color: #fff;
    position: fixed;
    top: 0;
    left: ${(props) => (props.isOpen ? "0" : "-250px")};
    transition: left 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    z-index: 1;

    @media (max-width: 768px) {
      left: -250px;
    }
  `;
  const HamburgerMenu = styled.div`
    position: fixed;
    top: 20px;
    left: 20px;
    cursor: pointer;
    z-index: 2;
  `;
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <HamburgerMenu onClick={toggleSidebar}>☰</HamburgerMenu>
      <SidebarContainer isOpen={isOpen}>
        <Main>
          <div>
            <Info>Sort by Price:</Info>
            <label>
              <input
                type="radio"
                name="sort"
                value="asc"
                checked={sortOrder === "asc"}
                onChange={handleSortChange}
              />
              Low to High
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="desc"
                checked={sortOrder === "desc"}
                onChange={handleSortChange}
              />
              High to Low
            </label>
          </div>
          <div></div>
        </Main>
        <Category>
          <label>Filter by Category:</label>
          {getUniqueCategories(products).map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          ))}
        </Category>
      </SidebarContainer>
      <ContentContainer>
        <Container>
          {filteredProducts.slice(page * 10 - 10, page * 10).map((product) => {
            return (
              <>
                <Card>
                  <Title>{product.title}</Title>
                  <Image src={product.thumbnail} alt={product.title} />
                  <Description>{product.description}</Description>
                  <Price>₹ {product.price}</Price>
                  {/* <h3>{product.category}</h3> */}
                </Card>
              </>
            );
          })}
        </Container>
        {products.length > 0 && (
          <Pagination>
            <span
              onClick={() => selectPageHandler(page - 1)}
              className={page > 1 ? "" : { Disable }}
            >
              ◀
            </span>

            {[...Array(products.length / 10)].map((_, i) => {
              return (
                <span
                  key={i}
                  className={page === i + 1 ? { Selected } : ""}
                  onClick={() => selectPageHandler(i + 1)}
                >
                  {i + 1}
                </span>
              );
            })}

            <span
              onClick={() => selectPageHandler(page + 1)}
              className={page < products.length / 10 ? "" : { Selected }}
            >
              ▶
            </span>
          </Pagination>
        )}
      </ContentContainer>
    </>
  );
}
function getUniqueCategories(products) {
  return [...new Set(products.map((product) => product.category))];
}

export default App;
