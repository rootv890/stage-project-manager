import { useNotification } from "@/components/core/portals/notification-provider";

const LandingPage = () => {
  const data = useNotification();
  console.log(data);

  return (
    <div className="section">
      This is landing page!
      <button
        onClick={() =>
          data?.addNotification({
            message: "Hello" + Math.random,
            type: "error",
            show: true,
          })
        }
      >
        Add Notification
      </button>
    </div>
  );
};

export default LandingPage;
