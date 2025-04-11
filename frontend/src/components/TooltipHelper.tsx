import { Tooltip, Typography } from "@material-tailwind/react";

interface TooltipHelperProps {
  message: string;
}

const TooltipHelper = ({ message }: TooltipHelperProps) => {
  return (
    <Tooltip
      className="border bg-slateGray-100 px-2 py-4 shadow-xl shadow-black/10"
      content={
        <div className="max-w-xs">
          <Typography
            {...{
              variant: "small",
              color: "blue-gray",
              className: "font-normal opacity-80 text-center",
            } as React.ComponentProps<typeof Typography>}
          >
            {message}
          </Typography>
        </div>
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    </Tooltip>
  );
};

export default TooltipHelper;
