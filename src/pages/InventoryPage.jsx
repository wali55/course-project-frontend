import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import InventoryAccessControl from "../components/InventoryAccessControl";
import { useSelector } from "react-redux";
import InventorySettings from "../components/InventorySettings";
import CustomFieldsManager from "../components/CustomFieldsManager";
import IdFormatBuilder from "../components/IdFormatBuilder";

const InventoryPage = () => {
  const { inventory } = useSelector((state) => state.accessControl);
  const { user } = useSelector((state) => state.auth);

  const ownerAccess = inventory?.creator?.id === user?.id;
  const isAdmin = user?.role === "ADMIN";


  return (
    <div className="flex w-full flex-col">
      <h1 className="py-4 text-lg"><span className="font-semibold">Inventory Title:</span> {inventory.title}</h1>
      <Tabs
        aria-label="Options"
        classNames={{
          tab: "border rounded-md data-[selected=true]:border-blue-600",
        }}
      >
        <Tab key="items" title="Items">
          <Card>
            <CardBody>
              Items.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="chat" title="Chat">
          <Card>
            <CardBody>
              Chat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="settings" title="Settings">
          <Card>
            <CardBody>
              <InventorySettings inventory={inventory} />
            </CardBody>
          </Card>
        </Tab>
        {(ownerAccess || isAdmin) && (
          <>
            <Tab key="customId" title="Custom ID">
              <Card>
                <CardBody>
                  <IdFormatBuilder inventoryId={inventory?.id} />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="fields" title="Fields">
              <Card>
                <CardBody>
                  <CustomFieldsManager />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="access" title="Access">
              <Card>
                <CardBody>
                  <InventoryAccessControl />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="stats" title="Stats">
              <Card>
                <CardBody>
                  Stats.
                </CardBody>
              </Card>
            </Tab>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default InventoryPage;
