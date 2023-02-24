import React from "react";
import styled from "styled-components";
import { List, Typography } from "antd";
import { FormattedFlightType } from "../App";

const { Text } = Typography;

type Props = {
  flight: FormattedFlightType;
};

const FlightListItem: React.FC<Props> = ({ flight }) => (
  <List.Item>
    <ListItemContent>
      <FlightNumberText type="success">{flight.flightNumber}</FlightNumberText>

      {flight.departureTime}
      {" - "}
      {flight.arrivalTime}
    </ListItemContent>
  </List.Item>
);

const FlightNumberText = styled(Text)`
  margin-right: 24px;
  font-weight: bold;
`;

const ListItemContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default FlightListItem;
