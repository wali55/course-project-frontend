import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import InventoryAccessControl from "../components/InventoryAccessControl";
import { useDispatch, useSelector } from "react-redux";
import InventorySettings from "../components/InventorySettings";
import CustomFieldsManager from "../components/CustomFieldsManager";
import IdFormatBuilder from "../components/IdFormatBuilder";
import ItemManagement from "../components/ItemManagement";
import { useParams } from "react-router-dom";
import { fetchSingleInventory } from "../store/slices/inventoriesSlice";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const InventoryPage = () => {
  const dispatch = useDispatch();
  const { inventoryId } = useParams();

  useEffect(() => {
    if (!inventoryId) {
      return;
    }
    dispatch(fetchSingleInventory(inventoryId)).unwrap();
  }, [dispatch, inventoryId]);

  const { currentInventory: inventory } = useSelector(
    (state) => state.inventories
  );
  const { user } = useSelector((state) => state.auth);

  const ownerAccess = inventory?.creator?.id === user?.id;
  const isAdmin = user?.role === "ADMIN";

  if (!inventoryId) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="py-4 text-lg">
        <span className="font-semibold">Inventory Title:</span>{" "}
        {inventory?.title}
      </h1>
      <Tabs
        aria-label="Options"
        classNames={{
          tab: "border rounded-md data-[selected=true]:border-blue-600",
        }}
      >
        <Tab key="items" title="Items">
          <Card>
            <CardBody>
              <ItemManagement canEdit={true} inventoryId={inventory?.id} />
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
          </>
        )}
      </Tabs>
    </div>
  );
};

export default InventoryPage;
