import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNotification } from "@/components/core/portals/notification-provider";
import { CreateCourseSchema } from "./components/course.schema";
import { InfoIcon } from "lucide-react";

// 🛠️ Strongly typed Mentor List for better clarity
const MENTORSLIST: Array<{ id: string; name: string }> = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Doe" },
  { id: "3", name: "John Smith" },
];

const CreateCoursePage = () => {
  const { addNotification } = useNotification();

  // Form
  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      courseName: "",
      courseDescription: "",
      courseImage: "",
      courseStatus: "In Progress",
      courseProgress: 0,
      courseStartDate: new Date().toISOString().split("T")[0], // 🛠️ ISO formatted default date
      coursePrice: 0,
      courseLink: "",
      courseDuration: 0,
      courseRating: 0,
      courseMentorId: "0",
      courseTags: [],
    },
  });

  // Status options
  const statusOptions = [
    "Not Started",
    "Planned",
    "In Progress",
    "Paused",
    "Completed",
    "Abandoned",
    "Revisiting",
    "Failed",
    "On Hold",
    "Archived",
    "Suspended",
    "On Waitlist",
  ];

  // Submit
  const onSubmit = async (value: z.infer<typeof CreateCourseSchema>) => {
    const isNewMentor = value.courseMentorId === "0";

    if (isNewMentor) {
      // Simulate mentor creation API call
      console.log("Creating new mentor...");
      value.courseMentorId = Math.random().toString(36).substring(2);
    }

    console.log("Submitting course:", value);

    // Notify after successful submission 🎉
    addNotification({
      message: "Course added successfully! 🥳",
      type: "success",
      show: true,
    });
  };

  return (
    <div className="w-3/5 p-4 bg-zinc-950 border rounded-sm py-12">
      <div className="space-y-2 mb-6 text-center">
        <h1 className="font-bold text-2xl">Add New Course! </h1>
      </div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Course Name */}
          <FormField
            control={form.control}
            name="courseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Discrete Mathematics 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Course Description */}
          <FormField
            control={form.control}
            name="courseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Course Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-24"
                    placeholder="
                    Discrete mathmatics 101 is all about the basic concepts of discrete mathematics."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* St, Pro, du container */}
          <div className="flex items-center gap-2 justify-center nth">
            {/* Course Status */}
            <FormField
              control={form.control}
              name="courseStatus"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel className="required">Course Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Course Progress */}
            <FormField
              control={form.control}
              name="courseProgress"
              render={({ field: { onChange, ...field } }) => (
                <FormItem className="flex-1">
                  <FormLabel className="required">Course Progess (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      onChange={(e) => onChange(Number(e.target.value))}
                      {...field}
                      max={100}
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Course Duration  */}
            <FormField
              control={form.control}
              name="courseDuration"
              render={({ field: { onChange, ...field } }) => (
                <FormItem className="flex-1">
                  <FormLabel className="required">
                    Course Duration (hrs)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      onChange={(e) => onChange(Number(e.target.value))}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Course Price  */}
          <div className="flex items-center gap-2 justify-center nth">
            <FormField
              control={form.control}
              name="coursePrice"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="">Course Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      onChange={(e) => onChange(Number(e.target.value))}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseRating"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className=""> Rating</FormLabel>
                  <FormControl>
                    <Input
                      // placeholder="0"
                      onChange={(e) => onChange(Number(e.target.value))}
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="courseStartDate"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Couse Start Date</FormLabel>
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
          </div>

          {/* Course Link */}
          <FormField
            {...form}
            name="courseLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Course Link</FormLabel>
                <FormControl>
                  <Input placeholder="www.discrete-math-101.gg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mentors */}
          {/* Loop throught each mentor name with ids has values! */}
          {/* Option to create */}

          <Separator />

          <FormField
            control={form.control}
            name="courseMentorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">
                  Select or create Mentor{" "}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value === "0" ? "0" : field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or Create a New Mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"0"}>Create New Mentor</SelectItem>
                      <Separator className="my-2" />
                      {MENTORSLIST.length > 0 ? (
                        MENTORSLIST.map((mentor) => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.name}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">
                          No Mentors Found, Create New Mentor
                        </p>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/*on Create Mentor --- 0 */}
          {form.getValues("courseMentorId") === "0" && (
            <div className="flex items-stretch flex-col justify-stretch gap-3">
              {/* Mentor Name */}
              <FormField
                {...form}
                name="courseMentorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">Mentor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Max Black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" flex items-center justify-start border px-2 text-sm p-1 rounded-full text-green-100 border-green-500 bg-green-900">
                <InfoIcon className="p-1" />
                <p>
                  You can edit the mentor details later on the mentor's page.
                </p>
              </div>
            </div>
          )}

          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCoursePage;

// TODO : new mentor should have new id (FROM DB) when submitted
