import React, { useState } from "react";
import { AutoComplete } from "antd";
import airports from "../airports.json";

const MINIMUM_INPUT_LENGTH = 2;

const allAirportOptions: AirportOption[] = airports.map(
  (airport: AirportData) => ({
    label: airport.Name,
    value: airport.IATACode,
  })
);

type AirportData = {
  IATACode: string;
  Country: string;
  State: string;
  Name: string;
  Latitude: string;
  Longitude: string;
};

type AirportOption = {
  label: string;
  value: string;
};

type Props = {
  placeholder: string;
  onSelect: (selectedAirport: string) => void;
};

const AirportInput: React.FC<Props> = ({ placeholder, onSelect }) => {
  const [options, setOptions] = useState<AirportOption[]>([]);

  const onSearch = (inputText: string) => {
    if (inputText.length >= MINIMUM_INPUT_LENGTH) {
      const searchedOptions: AirportOption[] = allAirportOptions.filter(
        (airport) =>
          airport.label.toLowerCase().includes(inputText.toLowerCase()) ||
          airport.value.toLowerCase().includes(inputText.toLowerCase())
      );

      setOptions(searchedOptions);
    } else {
      setOptions([]);
    }
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      onSelect={onSelect}
      onSearch={onSearch}
      placeholder={placeholder}
    />
  );
};

export default AirportInput;
