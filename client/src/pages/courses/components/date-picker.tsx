import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type CourseDatePickerProps = {
  form: Form;
  onSubmit: (value: any) => void;
};

const CourseDatePicker = ({ form }: CourseDatePickerProps) => {
  return (
    <Form {...form}>
      <form
        onBlur={() => {
          onSubmit();
        }}
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="">Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  onChange={(e) => onChange(e.target.value)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CourseDatePicker;
