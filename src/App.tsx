import "antd-button-color/dist/css/style.css";

import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { DatePicker, Form, Empty, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import AirportInput from "./components/AirportInput";

type FormValues = {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
};

type FlightType = {
  flightNumber: number;
  flightType: string;
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

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<FlightType[]>([]);
  const [form] = Form.useForm();

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
      <div>
        <Form form={form} onFinish={onSubmit} validateTrigger="onSubmit">
          <FormItem
            name="departureAirport"
            rules={[
              {
                required: true,
                message: "Departure airport input is required",
              },
            ]}
          >
            {/* Departure Input */}
            <AirportInput
              onSelect={(airportCode) =>
                form.setFieldValue("departureAirport", airportCode)
              }
              placeholder="Select departure airport"
            />
          </FormItem>

          {/* Arrival Input */}
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
            />
          </FormItem>

          {/* Submit Button */}
          <Button htmlType="submit" type="success" loading={loading}>
            <SearchOutlined />
            Search
          </Button>
        </Form>

        <ResultWrapper>
          {flightData.length > 0 ? (
            <List
              bordered
              dataSource={flightData}
              renderItem={(flight) => (
                <List.Item>{`${flight.flightType} - ${flight.departure.date}: ${flight.departure.passengerLocalTime} => ${flight.arrival.date}: ${flight.arrival.passengerLocalTime}`}</List.Item>
              )}
            />
          ) : (
            <Empty />
          )}
        </ResultWrapper>
      </div>
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  width: 100%;
  height: 100%;
`;

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const ResultWrapper = styled.div`
  margin-top: 40px;
`;

export default App;
