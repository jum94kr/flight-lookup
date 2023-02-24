import React from "react";
import styled from "styled-components";
import { DatePicker, Form, Row, Col } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import Button from "antd-button-color";
import AirportInput from "./AirportInput";

export type FormValues = {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
};

type Props = {
  loading: boolean;
  onSubmit: (formValues: FormValues) => void;
};

const Toolbar: React.FC<Props> = ({ loading, onSubmit }) => {
  const [form] = Form.useForm();

  return (
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
  );
};

const FormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default Toolbar;
