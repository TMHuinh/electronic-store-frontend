import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import productApi from "../api/productApi";

const SearchPage = () => {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await productApi.getAll({ keyword });
        setProducts(res.data || []);
      } catch (error) {
        console.error("Lỗi tìm kiếm sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [keyword]);

  return (
    <Container className="mt-4">
      <h2 className="fw-bold text-primary mb-3 text-center">
        Kết quả tìm kiếm cho “{keyword}”
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {products.length === 0 ? (
            <Col className="text-center text-muted py-5">
              Không tìm thấy sản phẩm nào.
            </Col>
          ) : (
            products.map((p) => (
              <Col key={p._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="shadow-sm border-0 rounded-4">
                  <Card.Img
                    variant="top"
                    src={p.image || "https://via.placeholder.com/300x200"}
                    alt={p.name}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "1rem",
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{p.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      <span className="fw-bold text-primary">
                        {p.price?.toLocaleString()}₫
                      </span>
                    </Card.Text>
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

export default SearchPage;
