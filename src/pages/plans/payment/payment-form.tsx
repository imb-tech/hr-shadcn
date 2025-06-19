import { Button, Card, CardBody, Input, Tab, Tabs } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { WalletMinimal } from "lucide-react";
import { ReactNode } from "react";

function TabContent({ children }: { children: ReactNode }) {
  return (
    <Card className="shadow-none">
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export default function PaymentForm() {
  const { theme } = useTheme();
  return (
    <Tabs aria-label="payment types" className="grid p-0">
      <Tab
        key="click"
        title={
          <div className="w-24 flex justify-center">
            <img
              src={`/images/click${theme === "dark" ? "-dark.svg" : ".png"}`}
              width={100}
            />
          </div>
        }
        className="h-20  px-0"
      >
        <TabContent>
          <div className="p-5 flex gap-3">
            <Input
              label="Summa kiriting"
              labelPlacement="outside"
              placeholder="Ex: 450,000"
              className="w-2/3"
              endContent="so'm"
            />
            <Button color="primary" className="mt-6 !w-1/3">
              To'lov qilish
            </Button>
          </div>
        </TabContent>
      </Tab>
      <Tab
        key="payme"
        className="h-20  px-0"
        title={
          <div className="w-24 flex justify-center">
            <img
              src={`/images/payme${theme === "dark" ? "-dark.svg" : ".png"}`}
              width={100}
            />
          </div>
        }
      >
        <TabContent>
          <div className="p-5 flex gap-3">
            <Input
              label="Summa kiriting"
              labelPlacement="outside"
              placeholder="Ex: 450,000"
              className="w-2/3"
              endContent="so'm"
            />
            <Button color="primary" className="mt-6 !w-1/3">
              To'lov qilish
            </Button>
          </div>
        </TabContent>
      </Tab>
      <Tab
        key="cashback"
        className="h-20  px-0"
        title={
          <div className="flex items-center gap-3 w-[180px]">
            <span className="flex items-center justify-center bg-success-500/15 p-2 rounded-xl">
              <WalletMinimal className="text-success-500" size={32} />
            </span>
            <div className="flex flex-col items-start">
              <p className="text-lg text-success-500">Bonus</p>
              <p className="text-lg">{(500000).toLocaleString()} so'm</p>
            </div>
          </div>
        }
      >
        <TabContent>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex gap-3">
              <Input
                label="Summa kiriting"
                labelPlacement="outside"
                placeholder="Ex: 450,000"
                className="w-2/3"
                defaultValue="500,000"
                endContent="so'm"
              />
              <Button color="primary" className="mt-6 !w-1/3">
                To'lov qilish
              </Button>
            </div>
          </div>
        </TabContent>
      </Tab>
    </Tabs>
  );
}
