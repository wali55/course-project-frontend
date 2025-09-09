import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchSingleHomeInventory } from "../store/slices/homeSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import HomeInventoryItems from "../components/HomeInventoryItems";

const HomeInventoryPage = () => {
  const dispatch = useDispatch();
  const { inventoryId } = useParams();

  useEffect(() => {
    if (!inventoryId) {
      return;
    }
    dispatch(fetchSingleHomeInventory(inventoryId)).unwrap();
  }, [dispatch, inventoryId]);

  const { singleInventory: inventory } = useSelector(
    (state) => state.home
  );

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
              <HomeInventoryItems inventoryId={inventoryId} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default HomeInventoryPage;
