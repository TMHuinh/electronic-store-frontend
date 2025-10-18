import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi trang load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">Sản phẩm nổi bật</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {products.length === 0 ? (
            <Col className="text-center text-muted">Không có sản phẩm nào</Col>
          ) : (
            products.map((product) => (
              <Col
                key={product._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4 d-flex"
              >
                <Card className="shadow-sm flex-fill border-0 rounded-4">
                  <Card.Img
                    variant="top"
                    src={
                      product.image ||
                      'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    alt={product.name}
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: '1rem',
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{product.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {product.brand?.name || 'Thương hiệu'} <br />
                      <span className="fw-bold text-primary">
                        {product.price?.toLocaleString()}₫
                      </span>
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      className="w-100 rounded-pill"
                    >
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;
