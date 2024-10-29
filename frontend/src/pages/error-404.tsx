import { useRouteError } from "react-router-dom";

function PageNotFound() {
  const error = useRouteError();
  console.log(error);
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1>OOPS!!</h1>
      {/*  @ts-expect-error error works just fine! */}
      <p>{error.statusText}</p>
    </div>
  );
}

export default PageNotFound;
