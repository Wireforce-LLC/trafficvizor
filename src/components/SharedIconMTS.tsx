interface Props {
  readonly size: number;
}

export default function SharedIconMTS({ size }: Props) {
  return (
    <svg
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0.011 0.003 393.729 97.99499999999999"
    >
      <path
        d="M35.009.003c-7.305 0-15.966 7.023-23.11 18.83C4.453 31.061.011 46.199.011 59.345c0 19.245 10.8 38.653 35 38.653 24.171 0 35-19.408 35-38.653 0-13.146-4.44-28.284-11.85-40.512C50.95 7.026 42.29.003 35.009.003zM224 28.877h24.5V92.75h26.25V28.877h24.49V5.25H224v23.624zm131.24 0h38.5V5.25h-38.5c-35.37 0-54.26 17.586-54.26 43.747s18.89 43.753 54.26 43.753h38.5V69.124h-38.5c-16.37 0-27.13-5.851-27.13-20.124s10.76-20.123 27.13-20.123zM170.61 5.25l-13.99 52.225L142.63 5.25H96.26v87.5h26.24V21.58l19.07 71.17h30.1l19.08-71.213V92.75H217V5.25z"
        fill="#e30613"
        fillRule="evenodd"
      />
    </svg>
  );
}
