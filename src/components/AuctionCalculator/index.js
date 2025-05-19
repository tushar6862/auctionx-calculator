import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSpring, animated, config } from "react-spring";
import Logo from "../../assets/auctionx-logo1.png";
import "./style.css";

const AuctionCalculator = () => {
  // Animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  // Validation schema
  const validationSchema = Yup.object({
    communitySize: Yup.number()
      .required("Required")
      .positive("Must be positive"),
    bidderConversionPercent: Yup.number()
      .required("Required")
      .min(0, "Must be at least 0")
      .max(100, "Must be at most 100"),
    avgBidsPerPerson: Yup.number()
      .required("Required")
      .positive("Must be positive"),
    bidsGivenBackPercent: Yup.number()
      .required("Required")
      .min(0, "Must be at least 0")
      .max(100, "Must be at most 100"),
    perBidCost: Yup.number().required("Required").min(0, "Must be at least 0"),
    productCost: Yup.number().required("Required").min(0, "Must be at least 0"),
    auctionsPerDay: Yup.number()
      .required("Required")
      .positive("Must be positive")
      .integer("Must be an integer"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      communitySize: "",
      bidderConversionPercent: "",
      avgBidsPerPerson: "",
      bidsGivenBackPercent: "",
      perBidCost: 0.1,
      productCost: "",
      auctionsPerDay: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  // State for showing results
  const [showResults, setShowResults] = useState(false);

  // Calculated values
  const [calculations, setCalculations] = useState({
    totalExpectedBids: 0,
    netBids: 0,
    bidsSoldFor: 0,
    netProfit: 0,
    profitPerDay: 0,
  });

  // Update calculations when form values change
  useEffect(() => {
    const totalExpectedBids =
      formik.values.communitySize *
      (formik.values.bidderConversionPercent / 100) *
      formik.values.avgBidsPerPerson;
    const bidsGivenBack =
      totalExpectedBids * (formik.values.bidsGivenBackPercent / 100);
    const netBids = totalExpectedBids - bidsGivenBack;

    // Updated calculation: Bids sold for = net bids * per bid cost
    const bidsSoldFor = netBids * formik.values.perBidCost;

    // Net profit calculation
    const netProfit = bidsSoldFor - formik.values.productCost;
    const profitPerDay = netProfit * formik.values.auctionsPerDay;

    setCalculations({
      totalExpectedBids,
      netBids,
      bidsSoldFor,
      netProfit,
      profitPerDay,
    });
  }, [formik.values]);

  // Animation for results
  const resultsAnimation = useSpring({
    opacity: showResults ? 1 : 0,
    transform: showResults ? "translateY(0)" : "translateY(20px)",
    config: config.gentle,
  });

  return (
    <div className="auction-calculator-container">
      {/* Background circles */}
      <div className="background-circle circle-1"></div>
      <div className="background-circle circle-2"></div>
      <div className="background-circle circle-3"></div>
      <div className="background-circle circle-4"></div>
      <div className="logo-container">
        <img
          src={Logo}
          alt="Logo"
          className="logo-image"
          style={{ width: "200px", height: "auto" }}
        />
      </div>
      <animated.div style={formAnimation} className="form-card">
        <div className="form-header">
          <h4>Auctionx Calculator</h4>
          <hr />
        </div>
        <Card.Body className="p-1">
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-1">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label
                    htmlFor="communitySize"
                    className="floating-label"
                  >
                    Community size
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="communitySize"
                    id="communitySize"
                    value={formik.values.communitySize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.communitySize &&
                      formik.errors.communitySize
                    }
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.communitySize}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="text-start">
                  <Form.Label
                    htmlFor="bidderConversionPercent"
                    className="floating-label"
                  >
                    Bidder conversion %
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="bidderConversionPercent"
                    id="bidderConversionPercent"
                    value={formik.values.bidderConversionPercent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.bidderConversionPercent &&
                      formik.errors.bidderConversionPercent
                    }
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bidderConversionPercent}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label
                    htmlFor="avgBidsPerPerson"
                    className="floating-label"
                  >
                    Avg. number of bids/person
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="avgBidsPerPerson"
                    id="avgBidsPerPerson"
                    value={formik.values.avgBidsPerPerson}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.avgBidsPerPerson &&
                      formik.errors.avgBidsPerPerson
                    }
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.avgBidsPerPerson}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="result-form-group">
                  <Form.Label className="result-label text-start d-block">
                    Total expected bids
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={calculations.totalExpectedBids.toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                    disabled
                    readOnly
                    className="form-control-ms floating-input"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label
                    htmlFor="bidsGivenBackPercent"
                    className="floating-label"
                  >
                    Bids given back (Buy Now) %
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="bidsGivenBackPercent"
                    id="bidsGivenBackPercent"
                    value={formik.values.bidsGivenBackPercent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.bidsGivenBackPercent &&
                      formik.errors.bidsGivenBackPercent
                    }
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bidsGivenBackPercent}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="result-form-group">
                  <Form.Label className="result-label text-start d-block">
                    Net bids
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={calculations.netBids.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                    disabled
                    readOnly
                    className="form-control-ms floating-input"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label htmlFor="perBidCost" className="floating-label">
                    Per bid cost ($)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="perBidCost"
                    id="perBidCost"
                    value={formik.values.perBidCost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.perBidCost && formik.errors.perBidCost
                    }
                    step="0.01"
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.perBidCost}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="result-form-group">
                  <Form.Label className="result-label text-start d-block">
                    Bids sold for ($)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      `$` +
                      calculations.bidsSoldFor.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                    disabled
                    readOnly
                    className="form-control-ms floating-input"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label htmlFor="productCost" className="floating-label">
                    Product cost ($)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="productCost"
                    id="productCost"
                    value={formik.values.productCost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.productCost && formik.errors.productCost
                    }
                    step="0.01"
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.productCost}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group className="result-form-group">
                  <Form.Label className="result-label text-start d-block">
                    Net profit ($)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      `$` +
                      calculations.netProfit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                    disabled
                    readOnly
                    className={`form-control-ms floating-input result-value ${
                      calculations.netProfit >= 0
                        ? "profit-positive"
                        : "profit-negative"
                    }`}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group className="text-start">
                  <Form.Label
                    htmlFor="auctionsPerDay"
                    className="floating-label"
                  >
                    Auctions you can run per day
                  </Form.Label>{" "}
                  <Form.Control
                    type="number"
                    name="auctionsPerDay"
                    id="auctionsPerDay"
                    value={formik.values.auctionsPerDay}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.auctionsPerDay &&
                      formik.errors.auctionsPerDay
                    }
                    className="form-control-ms floating-input"
                    placeholder=" "
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.auctionsPerDay}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="result-form-group">
                  <Form.Label className="result-label text-start d-block">
                    Profit per day ($ auctions)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      `$` +
                      calculations.profitPerDay.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                    disabled
                    readOnly
                    className={`form-control-ms floating-input result-value ${
                      calculations.profitPerDay >= 0
                        ? "profit-positive"
                        : "profit-negative"
                    }`}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-5">
              <Button
                variant="outline-dark"
                size="lg"
                className="px-4 btn-reset"
                onClick={() => formik.resetForm()}
              >
                Reset
              </Button>
            </div>
          </Form>

          {showResults && (
            <animated.div style={resultsAnimation} className="mt-5">
              <Card className="results-card">
                <Card.Header className="bg-success text-white">
                  <h4 className="mb-0">Auction Results Summary</h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="result-item">
                        <span className="result-label">
                          Total Expected Bids:
                        </span>
                        <span className="result-value">
                          {calculations.totalExpectedBids.toLocaleString()}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Net Bids:</span>
                        <span className="result-value">
                          {calculations.netBids.toLocaleString()}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Bids Sold For:</span>
                        <span className="result-value">
                          $
                          {calculations.bidsSoldFor.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="result-item">
                        <span className="result-label">Net Profit:</span>
                        <span
                          className={`result-value ${
                            calculations.netProfit >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          $
                          {calculations.netProfit.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Profit Per Day:</span>
                        <span
                          className={`result-value ${
                            calculations.profitPerDay >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          $
                          {calculations.profitPerDay.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Annual Profit:</span>
                        <span
                          className={`result-value ${
                            calculations.profitPerDay * 365 >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          $
                          {(calculations.profitPerDay * 365).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center mt-4">
                    <Button
                      variant="outline-success"
                      size="lg"
                      onClick={() => setShowResults(false)}
                    >
                      Back to Calculator
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </animated.div>
          )}
        </Card.Body>
        {/* </Card> */}
      </animated.div>
    </div>
  );
};

export default AuctionCalculator;
