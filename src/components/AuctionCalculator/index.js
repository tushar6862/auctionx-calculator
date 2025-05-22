import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSpring, animated, config } from "react-spring";
import { FaArrowRight } from "react-icons/fa";
import Logo from "../../assets/auctionx-logo1.png";
import "./style.css";

const AuctionCalculator = () => {
  const inputRef = useRef(null);
  const [showResults, setShowResults] = useState(false);

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
      title: `If you plan an auction like "Win an iPhone for 1$", how many people do you think would be interested?`,
    },
    {
      name: "bidderConversionPercent",
      label: "Bidder conversion %",
      title: `How many of these will actually come and participate to "Win the iPhone" for 1$?`,
    },
    {
      name: "perBidCost",
      label: "Per bid cost ($)",
      step: "0.01",
      title: `Rate per bid ($)`,
    },
    {
      name: "avgBidsPerPerson",
      label: "Avg. number of bids/person",
      title: `How much average amount do you think a bidder would comfortably spend in an auction?`,
    },
    {
      name: "bidsGivenBackPercent",
      label: "Bids given back (Buy Now) %",
      title: `Once the auction finishes a small percentage of bidders will exercise the "Buy Now" option - where we refund the bids. 
  Estimate the percentage of bidders ("Buy Now")`,
    },
    {
      name: "productCost",
      label: "Product cost ($)",
      step: "0.01",
      title: `Cost of product under auction ($)`,
    },
    // {
    //   name: "auctionsPerDay",
    //   label: "Auctions you can run per day",
    //   title: `Auctions you can run per day`,
    // },
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
    productCostAmount: 0,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeField]);

  // Update calculations when form values change
  // Update calculations when form values change
  useEffect(() => {
    // Total participants calculation
    const totalParticipants =
      formik.values.communitySize *
      (formik.values.bidderConversionPercent / 100);

    // Total estimated collection (A)
    const totalCollection = totalParticipants * formik.values.avgBidsPerPerson;

    // Calculate bids per bidder (based on avg spend and per bid cost)
    const bidsPerBidder =
      formik.values.avgBidsPerPerson / formik.values.perBidCost;

    // Total number of bids sold
    const totalExpectedBids = totalCollection / formik.values.perBidCost;

    // Calculate bidders using Buy Now
    const biddersUsingBuyNow =
      totalParticipants * (formik.values.bidsGivenBackPercent / 100);

    // Calculate bids refunded back (B)
    const bidsRefundedBack = biddersUsingBuyNow * bidsPerBidder;

    // Calculate refund amount (R)
    const refundAmount = bidsRefundedBack * formik.values.perBidCost;

    // Calculate net collection (N = A - R)
    const netCollection = totalCollection - refundAmount;

    // Net profit calculation (Net Profit = N - C)
    const netProfit = netCollection - formik.values.productCost;

    // Profit per day
    const profitPerDay = netProfit * formik.values.auctionsPerDay;

    setCalculations({
      totalParticipants,
      totalExpectedBids,
      totalCollection,
      bidsPerBidder,
      bidsRefundedBack,
      refundAmount,
      netCollection,
      netProfit,
      profitPerDay,
      perCost: formik.values.perBidCost,
      productCostAmount: formik.values.productCost,
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
    <div className="auction-calculator-container gradientAni">
      {/* Background elements */}
      <div className="noise"></div>

      <div className="logo-container d-flex align-items-center justify-content-between w-100 responsive-padding">
        <img
          src={Logo}
          alt="AuctionX Logo"
          className="logo-image"
          style={{ width: "200px", height: "auto" }}
        />
        <Button
          variant="outline-dark"
          size="sm"
          className="px-4 btn-reset hover-effect bg-light text-dark"
          onClick={() => {
            formik.resetForm();
            setActiveField("communitySize");
            setCompletedFields([]);
            setShowResults(false);
          }}
        >
          Reset
        </Button>
      </div>

      <animated.div style={formAnimation} className="calculator-content">
        <Row className="calculator-row">
          {/* Left Column - Input Fields */}
          <Col xs={12} md={12} lg={4} className="form-column mb-3 mb-md-0">
            <Card className="h-100 input-card shadow-lg">
              <Card.Header className="bg-gradient-primary text-white">
                <h5 className="mb-0">Input</h5>
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
                        <div className="d-flex align-items-center mt-2">
                          <Form.Control
                            type="number"
                            name={field.name}
                            id={field.name}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                formik.values[field.name] &&
                                !formik.errors[field.name]
                              ) {
                                e.preventDefault();
                                moveToNextField(field.name);
                              }
                            }}
                            isInvalid={
                              formik.touched[field.name] &&
                              formik.errors[field.name]
                            }
                            className="form-control-ms floating-input shadow-sm no-spinner"
                            placeholder=" "
                            step={field.step || "1"}
                            ref={field.name === activeField ? inputRef : null}
                            style={{ width: "70%" }}
                          />
                          {field.name === "avgBidsPerPerson" ? (
                            <span className="fs-5 ms-2 me-2">$</span>
                          ) : (
                            (field.name === "bidderConversionPercent" ||
                              field.name === "bidsGivenBackPercent") && (
                              <span className="fs-5 ms-2 me-2">%</span>
                            )
                          )}
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
                        <Form.Control.Feedback type="invalid">
                          {formik.errors[field.name]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </animated.div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Middle Column - Value List */}
          <Col xs={12} md={12} lg={4} className="value-column mb-3 mb-md-0">
            <Card className="h-100 value-card shadow-lg">
              <Card.Header className="bg-gradient-primary text-white">
                <h5 className="mb-0">Verify</h5>
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
                        <span
                          className="value-label"
                          style={{ fontSize: "15px" }}
                        >
                          {field.label}:
                        </span>
                      </div>
                      <span
                        className="value-value badge bg-light text-dark"
                        style={{ fontSize: "15px" }}
                      >
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
              <Card.Header className="bg-gradient-primary text-white">
                <h5 className="mb-0">Voila !!</h5>
              </Card.Header>
              <Card.Body>
                {!showResults && (
                  <div className="text-center mb-4">
                    <Button
                      variant="success"
                      size="md"
                      className="shadow-lg"
                      onClick={() => setShowResults((prev) => !prev)}
                      disabled={!completedFields.includes("productCost")}
                      style={{
                        backgroundColor: completedFields.includes("productCost")
                          ? "#28a745"
                          : "#6c757d",
                        borderColor: completedFields.includes("productCost")
                          ? "#28a745"
                          : "#6c757d",
                        cursor: completedFields.includes("productCost")
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      Show me my PROFIT!!
                    </Button>
                  </div>
                )}
                {showResults && (
                  <Table striped bordered hover style={{ fontSize: "15px" }}>
                    <tbody>
                      <tr>
                        <td className="text-start">
                          Total Number of Bids Sold:
                        </td>
                        <td className="text-start">
                          {" "}
                          {calculations.totalExpectedBids?.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Price per bid:</td>
                        <td className="text-start">
                          {" "}
                          $
                          {calculations.perCost?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">
                          Total Estimated Collection
                        </td>
                        <td className="text-start">
                          {" "}
                          $
                          {calculations.totalCollection?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">
                          Amount refunded back due to "Buy Now" :
                        </td>
                        <td className="text-start">
                          $
                          {calculations.refundAmount?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Net Collection:</td>
                        <td className="text-start">
                          {" "}
                          $
                          {calculations.netCollection?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">Product price:</td>
                        <td className="text-start">
                          $
                          {calculations.productCostAmount?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr
                        className={
                          calculations.netProfit > 0 ? "profit-row-blink" : ""
                        }
                      >
                        <td className="text-start">
                          {calculations.netProfit > 0
                            ? "Net profit for the auction:"
                            : "Net loss for the auction:"}
                        </td>
                        <td className="text-start">
                          $
                          {calculations.netProfit?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || 0}
                        </td>
                      </tr>
                      {/* <tr>
                        <td className="text-start">Profit per Day:</td>
                        <td className="text-start">
                          $
                          {calculations.profitPerDay?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-start">
                          Estimated yearly collection:
                        </td>
                        <td className="text-start">
                          {" "}
                          $
                          {(calculations.profitPerDay * 365)?.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          ) || 0}
                        </td>
                      </tr> */}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </animated.div>
    </div>
  );
};

export default AuctionCalculator;
