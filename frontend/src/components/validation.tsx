import { FieldError } from "react-hook-form";

function Validation({ error }: { error: FieldError }) {
  return (
    <p className="mt-1 text-sm p-3 rounded-md bg-destructive/30 text-destructive">
      {error.message}
    </p>
  );
}

export default Validation;
