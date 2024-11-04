import { Outlet } from "react-router-dom";

type Props = {};

const CreateLayout = (props: Props) => {
  return (
    <section className=" bg-background  pt-4 max-w-screen-lg mx-auto  px-6">
      Create Layout
      <Outlet />
    </section>
  );
};

export default CreateLayout;
