import { Spin } from "antd";

export const FullPageLoader = () => {
  return (
    <div className="fixed w-screen h-screen bg-white z-[2000] top-0 left-0 opacity-75 flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
};
