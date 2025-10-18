import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 mt-5 border-top">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3">
            <h5 className="text-primary">Electronic Store</h5>
            <p className="small text-muted">
              Cung cấp thiết bị điện tử chính hãng, chất lượng cao và giá tốt nhất.
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Liên hệ</h6>
            <p className="mb-1 text-muted">📧 support@estore.vn</p>
            <p className="text-muted">📞 0123 456 789</p>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Theo dõi chúng tôi</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5">
              <a href="#" className="text-primary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-primary">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-primary">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className="text-center text-muted small">
            © {new Date().getFullYear()} Electronic Store. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
