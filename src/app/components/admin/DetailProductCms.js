import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import TechnicalDetailForm from "./ui/TechnicalDetailForm";
import ProductDetailForm from "./ui/ProductDetailForm";
import SaleDetailForm from "./ui/SaleDetailForm";

const DetailProductCms = ({ product }) => {

  return (
    <>
      <Tabs>
        <Tab title="Thông tin chung">
          <Card>
            <CardBody>
              <ProductDetailForm product={product}></ProductDetailForm>
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Thông số kĩ thuật">
          <Card>
            <CardBody>
              <TechnicalDetailForm product={product}></TechnicalDetailForm>
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Thông số bán hàng">
          <Card>
            <CardBody>
              <SaleDetailForm product={product}></SaleDetailForm>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

    </>
  );
};

export default DetailProductCms;
