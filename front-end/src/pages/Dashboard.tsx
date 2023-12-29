import { Center, Flex, Button } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  reset,
  decrement,
  increment,
  incrementByAmount,
} from "../features/counter/counterSlice";
import { useState } from "react";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { value } = useAppSelector((state) => state.counter);
  const [number, setNumber] = useState<number | "">(5);
  return (
    <div>
      <h1>This is dashboard component. Im here cause im authenticated!</h1>
      <h2>Test your counter app!</h2>

      <Center className="flex flex-col">
        <div className="text-[100px]">
          {value}
        </div>
        <Flex gap={20}>
          <Button color="gray" onClick={() => dispatch(reset())}>
            Reset
          </Button>
          <Button color="green" onClick={() => dispatch(increment())}>
            Increment
          </Button>
          <Button color="red" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button onClick={() => dispatch(incrementByAmount(Number(number)))}>
            Increment By Amount
          </Button>
        </Flex>
      </Center>
    </div>
  );
};

export default Dashboard;
