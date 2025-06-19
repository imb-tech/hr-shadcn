import { IconSvgProps } from "@/types";

export const HomeIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
      <path
        d="M15 18H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />{" "}
    </g>
  </svg>
);

export const ProfileIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g id="style=linear">
        {" "}
        <g id="profile">
          {" "}
          <path
            d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z"
            id="vector"
            stroke="currentcolor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />{" "}
          <path
            d="M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z"
            id="rec"
            stroke="currentcolor"
            strokeWidth="1.5"
          />{" "}
        </g>{" "}
      </g>{" "}
    </g>
  </svg>
);

export const UsersIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    height={size || height}
    width={size || width}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-hidden="true"
  >
    <path
      clipRule="evenodd"
      d="M12 1.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5M8.75 6a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M18 3.25a.75.75 0 0 0 0 1.5c1.377 0 2.25.906 2.25 1.75S19.377 8.25 18 8.25a.75.75 0 0 0 0 1.5c1.937 0 3.75-1.333 3.75-3.25S19.937 3.25 18 3.25M6.75 4A.75.75 0 0 0 6 3.25c-1.937 0-3.75 1.333-3.75 3.25S4.063 9.75 6 9.75a.75.75 0 0 0 0-1.5c-1.376 0-2.25-.906-2.25-1.75S4.624 4.75 6 4.75A.75.75 0 0 0 6.75 4"
      fill="currentColor"
    />
    <path
      clipRule="evenodd"
      d="M12 12.25c-1.784 0-3.434.48-4.659 1.297-1.22.814-2.091 2.02-2.091 3.453s.871 2.64 2.091 3.453c1.225.816 2.875 1.297 4.659 1.297s3.434-.48 4.659-1.297c1.22-.814 2.091-2.02 2.091-3.453s-.872-2.64-2.091-3.453c-1.225-.816-2.875-1.297-4.659-1.297M6.75 17c0-.776.472-1.57 1.423-2.204.947-.631 2.298-1.046 3.827-1.046 1.53 0 2.88.415 3.827 1.046.951.634 1.423 1.428 1.423 2.204s-.472 1.57-1.423 2.204c-.947.631-2.298 1.046-3.827 1.046-1.53 0-2.88-.415-3.827-1.046C7.222 18.57 6.75 17.776 6.75 17"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M19.267 13.84a.75.75 0 0 1 .894-.573c.961.211 1.828.592 2.472 1.119.643.526 1.117 1.25 1.117 2.114 0 .865-.474 1.588-1.117 2.114-.644.527-1.51.908-2.472 1.119a.75.75 0 0 1-.322-1.466c.793-.173 1.426-.472 1.844-.814s.567-.677.567-.953-.149-.61-.567-.953-1.051-.64-1.844-.814a.75.75 0 0 1-.572-.894M3.84 13.267a.75.75 0 1 1 .32 1.466c-.792.173-1.425.472-1.843.814s-.567.677-.567.953.149.61.567.953 1.051.64 1.844.814a.75.75 0 0 1-.322 1.466c-.962-.211-1.828-.592-2.472-1.119C.724 18.088.25 17.364.25 16.5c0-.865.474-1.588 1.117-2.114.644-.527 1.51-.908 2.472-1.119"
      fill="currentColor"
    />
  </svg>
);
