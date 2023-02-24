import "antd-button-color/dist/css/style.css";

import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  DatePicker,
  Form,
  Empty,
  List,
  Row,
  Col,
  Divider,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import AirportInput from "./components/AirportInput";

const { Title, Text } = Typography;

type FormValues = {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
};

type FlightType = {
  codeshare: {
    comment050?: {
      code: string;
      serviceNumber: string;
    };
  };
  departure: {
    airport: { iata: string };
    date: string;
    passengerLocalTime: string;
    terminal: string;
  };
  arrival: {
    airport: { iata: string };
    date: string;
    passengerLocalTime: string;
    terminal: string;
  };
};

type FormattedFlightType = {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<FlightType[]>([]);
  const [form] = Form.useForm();

  const formattedFlightData: FormattedFlightType[] = flightData
    .filter((flight) => !!flight?.codeshare?.comment050)
    .map((flight) => ({
      flightNumber: `${flight.codeshare.comment050?.code}${flight.codeshare.comment050?.serviceNumber}`,
      departureTime: `${flight.departure.date} ${flight.departure.passengerLocalTime}`,
      arrivalTime: `${flight.arrival.date} ${flight.departure.passengerLocalTime}`,
    }))
    .reduce<FormattedFlightType[]>((previous, current) => {
      if (
        !previous.find((item) => item.flightNumber === current.flightNumber)
      ) {
        previous.push(current);
      }
      return previous;
    }, []);

  const onSubmit = async ({
    departureAirport,
    arrivalAirport,
    departureDate,
  }: FormValues) => {
    setLoading(true);

    try {
      const {
        data: { data: flightResponse },
      } = await axios.request({
        method: "GET",
        url: process.env.REACT_APP_API_URL,
        params: {
          version: "v1",
          DepartureDate: departureDate,
          DepartureAirport: departureAirport,
          ArrivalAirport: arrivalAirport,
        },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
          "X-RapidAPI-Host": process.env.REACT_APP_API_HOST,
        },
      });

      setFlightData(flightResponse);
    } catch (error) {
      console.error(error);
      setFlightData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Body>
      <Header level={2}>FLIGHT SCHEDULE</Header>

      <Form form={form} onFinish={onSubmit} validateTrigger="onSubmit">
        <Row gutter={8}>
          <Col span={12}>
            {/* Departure Airport Input */}
            <FormItem
              name="departureAirport"
              rules={[
                {
                  required: true,
                  message: "Departure airport input is required",
                },
              ]}
            >
              <AirportInput
                onSelect={(airportCode) =>
                  form.setFieldValue("departureAirport", airportCode)
                }
                placeholder="Select departure airport"
              />
            </FormItem>
          </Col>

          <Col span={12}>
            {/* Arrival Airport Input */}
            <FormItem
              name="arrivalAirport"
              rules={[
                {
                  required: true,
                  message: "Arrival airport input is required",
                },
              ]}
            >
              <AirportInput
                onSelect={(airportCode) =>
                  form.setFieldValue("arrivalAirport", airportCode)
                }
                placeholder="Select arrival airport"
              />
            </FormItem>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            {/* Date Input */}
            <FormItem
              name="departureDate"
              rules={[
                { required: true, message: "Departure date input is required" },
              ]}
              valuePropName="date"
            >
              <DatePicker
                onChange={(date, dateString) =>
                  form.setFieldValue("departureDate", dateString)
                }
                style={{ width: "100%" }}
              />
            </FormItem>
          </Col>
        </Row>

        {/* Submit Button */}
        <ButtonWrapper>
          <Button htmlType="submit" type="success" loading={loading}>
            <SearchOutlined />
            Search
          </Button>
        </ButtonWrapper>
      </Form>

      <Divider />

      <ResultWrapper>
        {flightData.length > 0 ? (
          <List
            bordered
            dataSource={formattedFlightData}
            renderItem={(flight) => <FlightListItem flight={flight} />}
          />
        ) : (
          <Empty />
        )}
      </ResultWrapper>
    </Body>
  );
};

type FlightListItemProps = {
  flight: FormattedFlightType;
};

const FlightListItem: React.FC<FlightListItemProps> = ({ flight }) => (
  <List.Item>
    <ListItemContent>
      <FlightNumberText type="success">{flight.flightNumber}</FlightNumberText>

      {flight.departureTime}
      {" - "}
      {flight.arrivalTime}
    </ListItemContent>
  </List.Item>
);

const Header = styled(Title)`
  display: flex;
  justify-content: center;
  font-weight: 500;
  letter-spacing: 8px;
  margin-bottom: 42px !important;
`;

const Body = styled.div`
  margin: 40px auto;
  max-width: 600px;
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const ResultWrapper = styled.div`
  margin-top: 40px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FlightNumberText = styled(Text)`
  margin-right: 24px;
  font-weight: bold;
`;

const ListItemContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default App;
