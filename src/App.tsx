import "antd-button-color/dist/css/style.css";

import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Empty, List, Divider, Typography } from "antd";

import Toolbar, { FormValues } from "./components/Toolbar";
import FlightListItem from "./components/FlightListItem";

const { Title } = Typography;

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

export type FormattedFlightType = {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<FlightType[]>([]);

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

      <Toolbar loading={loading} onSubmit={onSubmit} />

      <Divider />

      <ListContainer>
        {flightData.length > 0 ? (
          <List
            bordered
            dataSource={formattedFlightData}
            renderItem={(flight) => <FlightListItem flight={flight} />}
          />
        ) : (
          <Empty />
        )}
      </ListContainer>
    </Body>
  );
};

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

const ListContainer = styled.div`
  margin-top: 40px;
`;

export default App;
