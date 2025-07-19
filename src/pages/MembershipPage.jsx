import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import Footer from '../components/Footer';
import '../assets/css/MembershipPage.css';

function MembershipPage() {
    return (
        <>
            <Container className="my-5 membership-container">
                <h4 className="text-center mb-4">Support Our Project & Unlock Advanced Features</h4>
                <p className="lead text-center mb-5">
                    Your contributions could empower our platform. Your support would help us maintain higher server capabilities and unlock premium features for our community.
                </p>

                <Row className="mt-5 justify-content-center">

                    {/* Current Free Features Card */}
                    <Col xs={12} md={6} lg={5} className="mb-5 mb-lg-0">
                        <Card className="h-100 bg-soft p-4 free-card">
                            {/* Header */}
                            <Card.Header className="pb-0 bg-transparent">
                                <span className="d-block">
                                    <span className="h3 font-weight-bold align-top">Free Tier</span>
                                </span>
                            </Card.Header>
                            {/* End Header */}
                            {/* Content */}
                            <Card.Body>
                                <ListGroup flush="true" className="price-list">
                                    <ListGroup.Item className="bg-soft ps-0"><strong>Natural Language Search:</strong> Find recipes with descriptive queries.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong>Standard Recipe Database:</strong> Access a curated collection of recipes.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong>Personal Saved Recipes:</strong> Bookmark your favorite dishes.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><span className="text-danger"><i className="fas fa-times-circle me-2"></i></span> Extended 5M+ Recipe Dataset</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><span className="text-danger"><i className="fas fa-times-circle me-2"></i></span> Ad-Free Browse</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><span className="text-danger"><i className="fas fa-times-circle me-2"></i></span> Priority Support</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0 pb-0"><span className="text-danger"><i className="fas fa-times-circle me-2"></i></span> Personalized Meal Planning</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                            {/* End Content */}
                        </Card>
                    </Col>

                    {/* Proposed Premium Features Card */}
                    <Col xs={12} md={6} lg={5} className="mb-5 mb-lg-0 mt-lg-n4"> {/* mt-lg-n4 for staggered effect */}
                        <Card className="h-100 bg-soft shadow-soft border-light p-4 premium-card">
                            {/* Header */}
                            <Card.Header className="pb-0 bg-transparent border-0">
                                <span className="d-block">
                                    <span className="h3 font-weight-bold align-top">Premium Tier</span>
                                </span>
                            </Card.Header>
                            {/* End Header */}
                            {/* Content */}
                            <Card.Body>
                                <ListGroup flush className="price-list">
                                    <ListGroup.Item className="bg-soft ps-0"><strong>All Free Features</strong></ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Extended 5M+ Recipe Dataset:</strong> Vastly expanded recipe library.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Ad-Free Browse:</strong> Enjoy an uninterrupted experience.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Priority Support:</strong> Get faster assistance.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Personalized Meal Planning:</strong> Custom meal suggestions.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft ps-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Early Feature Access:</strong> Be the first to try new tools.</ListGroup.Item>
                                    <ListGroup.Item className="bg-soft border-0 ps-0 pb-0"><strong><span className="text-success"><i className="fas fa-check-circle me-2"></i></span> Higher Server Capacity:</strong> Faster search results and more.</ListGroup.Item>
                                </ListGroup>
                                <a
                                    href="https://www.paypal.me/devanshmistry"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-block btn-primary text-secondary mt-4"
                                >
                                    <i className="fab fa-paypal"></i>   Donate with PayPal
                                </a>
                            </Card.Body>
                            {/* End Content */}
                        </Card>
                    </Col>
                </Row>

                <p className="text-center text-muted small mt-5">
                    This page demonstrates potential monetization strategies for future development and infrastructure. No real money will be transacted.
                </p>
            </Container>
            <Footer />
        </>
    );
}

export default MembershipPage;