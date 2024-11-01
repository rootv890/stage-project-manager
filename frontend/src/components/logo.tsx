function Logo({ size = 32 }: { size?: number }) {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="flex gap-2 items-center justify-center cursor-pointer hover:text-primary/50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className=" fill-foreground"
        viewBox="0 0 100 100"
      >
        <path d="M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597-18.425-4.323-32.93-18.827-37.252-37.252zM.002 46.889a.99.99 0 00.29.76L52.35 99.71c.201.2.478.307.76.29 2.37-.149 4.695-.46 6.963-.927.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50.067 50.067 0 00-.926 6.962zM4.21 29.705a.988.988 0 00.208 1.1l64.776 64.776c.289.29.726.375 1.1.208a49.908 49.908 0 005.185-2.684.981.981 0 00.183-1.54L8.436 24.336a.981.981 0 00-1.541.183 49.896 49.896 0 00-2.684 5.185zm8.448-11.631a.986.986 0 01-.045-1.354C21.78 6.46 35.111 0 49.952 0 77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 01-1.354-.045L12.659 18.074z"></path>
      </svg>
      <span className="select-none font-geist-mono text-zinc-900 hover:text-zinc-700 dark:text-zinc-200">
        Stage
      </span>
    </button>
  );
}

export default Logo;
