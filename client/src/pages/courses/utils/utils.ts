// 🛠️ Utility for Number Conversion
export const handleNumberChange =
  (onChange: (value: number) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };
