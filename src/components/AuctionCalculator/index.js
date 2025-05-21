import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSpring, animated, config } from "react-spring";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import Logo from "../../assets/auctionx-logo1.png";
import "./style.css";

const AuctionCalculator = () => {
  const inputRef = useRef(null);
  // Animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  // State to track which field is active
  const [activeField, setActiveField] = useState("communitySize");

  // State to track completed fields
  const [completedFields, setCompletedFields] = useState([]);

  // Fields configuration
  const fields = [
    {
      name: "communitySize",
      label: "Community size",
      title: `If you plan an auction like "Win an iPhone for 1$", how many people can you reach out to?`,
    },
    {
      name: "bidderConversionPercent",
      label: "Bidder conversion %",
      title: `What percentage of those do you think will participate in an auction?`,
    },
    {
      name: "avgBidsPerPerson",
      label: "Avg. number of bids/person",
      title: `How much is the average amount you think a bidder would comfortably spend in an auction?`,
    },
    {
      name: "bidsGivenBackPercent",
      label: "Bids given back (Buy Now) %",
      title: `Estimate the percentage of bidders`,
    },
    {
      name: "perBidCost",
      label: "Per bid cost ($)",
      step: "0.01",
      title: `Rate per bid`,
    },
    {
      name: "productCost",
      label: "Product cost ($)",
      step: "0.01",
      title: `Cost of product under auction ($)`,
    },
    {
      name: "auctionsPerDay",
      label: "Auctions you can run per day",
      title: `Auctions you can run per day`,
    },
  ];

  // Function to move to the next field
  const moveToNextField = (currentField) => {
    // Add current field to completed fields
    if (!completedFields.includes(currentField)) {
      setCompletedFields([...completedFields, currentField]);
    }

    // Find the current field index
    const currentIndex = fields.findIndex(
      (field) => field.name === currentField
    );
    if (currentIndex < fields.length - 1) {
      setActiveField(fields[currentIndex + 1].name);
    }
  };

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

  // Calculated values
  // Calculated values
  const [calculations, setCalculations] = useState({
    totalExpectedBids: 0,
    netBids: 0,
    bidsSoldFor: 0,
    netProfit: 0,
    profitPerDay: 0,
    perCost: 0,
    bidsRefundedBack: 0,
    refundAmount: 0,
    netCollection: 0,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeField]);

  // Update calculations when form values change
  // Update calculations when form values change
  useEffect(() => {
    const totalExpectedBids =
      formik.values.communitySize *
      (formik.values.bidderConversionPercent / 100) *
      formik.values.avgBidsPerPerson;

    // Calculate bids per bidder
    const bidsPerBidder = formik.values.avgBidsPerPerson;

    // Calculate bidders using Buy Now
    const biddersUsingBuyNow =
      formik.values.communitySize *
      (formik.values.bidderConversionPercent / 10) *
      (formik.values.bidsGivenBackPercent / 100);

    // Calculate bids refunded back
    const bidsRefundedBack = biddersUsingBuyNow * bidsPerBidder;

    // Calculate refund amount
    const refundAmount = bidsRefundedBack * formik.values.perBidCost;

    // Calculate net collection
    const totalCollection = totalExpectedBids * formik.values.perBidCost;
    const netCollection = totalCollection - refundAmount;

    const bidsGivenBack =
      totalExpectedBids * (formik.values.bidsGivenBackPercent / 100);
    const netBids = totalExpectedBids - bidsGivenBack;

    // Updated calculation: Bids sold for = net bids * per bid cost
    const bidsSoldFor = netBids * formik.values.perBidCost;

    const perCost = formik.values.perBidCost;

    // Net profit calculation
    const netProfit = bidsSoldFor - formik.values.productCost;
    const profitPerDay = netProfit * formik.values.auctionsPerDay;

    setCalculations({
      totalExpectedBids,
      netBids,
      bidsSoldFor,
      netProfit,
      profitPerDay,
      perCost,
      bidsRefundedBack,
      refundAmount,
      netCollection,
    });
  }, [formik.values]);

  // Animation for active field
  const activeFieldAnimation = useSpring({
    opacity: 1,
    height: "auto",
    transform: "translateY(0)",
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className="auction-calculator-container">
      {/* Background elements */}
      <div className="background-circle circle-1"></div>
      <div className="background-circle circle-2"></div>
      <div className="background-circle circle-3"></div>
      <div className="background-circle circle-4"></div>
      <div className="noise"></div>

      <div className="logo-container">
        <img
          src={Logo}
          alt="AuctionX Logo"
          className="logo-image"
          style={{ width: "200px", height: "auto" }}
        />
      </div>

      <animated.div style={formAnimation} className="calculator-content">
        <div className="form-header text-center mb-2">
          <h3 className="text-primary">AuctionX Calculator</h3>
        </div>

        <Row className="g-3 calculator-row">
          {/* Left Column - Input Fields */}
          <Col xs={12} md={12} lg={4} className="form-column mb-3 mb-md-0">
            <Card className="h-100 input-card shadow-lg">
              <Card.Header className="bg-gradient-primary text-white">
                <h5 className="mb-0">Add Values</h5>
              </Card.Header>
              <Card.Body>
                <div className="input-fields-container">
                  {fields.map((field) => (
                    <animated.div
                      key={field.name}
                      style={
                        field.name === activeField
                          ? activeFieldAnimation
                          : { display: "none" }
                      }
                      className="form-field-container"
                    >
                      <Form.Group className="text-start mb-3">
                        <Form.Label
                          htmlFor={field.name}
                          className="floating-label fw-bold"
                        >
                          {field.title}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name={field.name}
                          id={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                          }
                          className="form-control-ms floating-input shadow-sm"
                          placeholder=" "
                          step={field.step || "1"}
                          ref={field.name === activeField ? inputRef : null}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors[field.name]}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="text-center mt-3">
                        <button
                          type="button"
                          className="field-nav-button pulse-animation"
                          onClick={() => moveToNextField(field.name)}
                          disabled={
                            !formik.values[field.name] ||
                            formik.errors[field.name]
                          }
                        >
                          <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                    </animated.div>
                  ))}
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-center mt-4">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="px-4 btn-reset hover-effect"
                    onClick={() => {
                      formik.resetForm();
                      setActiveField("communitySize");
                      setCompletedFields([]);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Middle Column - Value List */}
          <Col xs={12} md={12} lg={4} className="value-column mb-3 mb-md-0">
            <Card className="h-100 value-card shadow-lg">
              <Card.Header className="bg-gradient-secondary text-white">
                <h5 className="mb-0">Finalise Values</h5>
              </Card.Header>
              <Card.Body>
                <div className="value-list-container">
                  {fields.map((field) => (
                    <div
                      key={`value-${field.name}`}
                      className={`value-item ${
                        completedFields.includes(field.name)
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="value-label-container">
                        <span className="value-label fw-bold">
                          {field.label}:
                        </span>
                        {completedFields.includes(field.name) && (
                          <FaCheck className="check-icon text-success" />
                        )}
                      </div>
                      <span className="value-value badge bg-light text-dark">
                        {completedFields.includes(field.name)
                          ? field.name === "perBidCost" ||
                            field.name === "productCost"
                            ? `$${formik.values[field.name]}`
                            : field.name === "bidderConversionPercent" ||
                              field.name === "bidsGivenBackPercent"
                            ? `${formik.values[field.name]}%`
                            : formik.values[field.name]
                          : "--"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Results */}
          <Col xs={12} md={12} lg={4} className="results-column mb-3 mb-md-0">
            <Card className="h-100 results-card shadow-lg">
              <Card.Header className="bg-gradient-success text-white">
                <h5 className="mb-0">Final Calculatation</h5>
              </Card.Header>
              <Card.Body>
                <div className="results-summary">
                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Total estimated collection:
                    </span>
                    <span className="result-value badge bg-primary">
                      $
                      {calculations.totalExpectedBids.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Considering each bid is for ${calculations?.perCost} the
                      total number of bids sold:
                    </span>
                    <span className="result-value badge bg-primary">
                      {calculations.totalExpectedBids.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Bids refunded back:
                    </span>
                    <span className="result-value badge bg-primary">
                      {calculations.bidsRefundedBack.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Refund amount:
                    </span>
                    <span className="result-value badge bg-primary">
                      $
                      {calculations.refundAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Net collection now stands at:
                    </span>
                    <span className="result-value badge bg-primary">
                      $
                      {calculations.netCollection.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Net Bids:
                    </span>
                    <span className="result-value badge bg-primary">
                      {calculations.netBids.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Bids Sold For:
                    </span>
                    <span className="result-value badge bg-primary">
                      $
                      {calculations.bidsSoldFor.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label fw-bold text-start">
                      Net Profit:
                    </span>
                    <span
                      className={`result-value badge ${
                        calculations.netProfit >= 0 ? "bg-success" : "bg-danger"
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
                    <span className="result-label fw-bold text-start">
                      Estimated profit per day:
                    </span>
                    <span
                      className={`result-value badge ${
                        calculations.profitPerDay >= 0
                          ? "bg-success"
                          : "bg-danger"
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
                    <span className="result-label fw-bold text-start">
                      Annual Profit:
                    </span>
                    <span
                      className={`result-value badge ${
                        calculations.profitPerDay * 365 >= 0
                          ? "bg-success"
                          : "bg-danger"
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
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </animated.div>
    </div>
  );
};

export default AuctionCalculator;
