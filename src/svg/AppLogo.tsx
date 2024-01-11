type AppLogoType = {
  fill?: string;
  className?: string;
};

const AppLogo = ({ fill = "#6646b0", className = "" }: AppLogoType) => {
  return (
    <svg
      width="48"
      height="60"
      viewBox="0 0 58 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_2_14)">
        <path
          d="M12.5218 18.336C12.5463 17.6087 12.9316 17.1589 13.6776 16.9867L15.0478 16.6704C15.4132 16.586 15.713 16.6691 15.9473 16.9197C16.1932 17.1516 16.318 17.4836 16.3215 17.9157L15.9838 31.2475L27.1281 28.6746L27.4342 14.8931C27.4588 14.1659 27.8516 13.7144 28.6129 13.5386L29.9602 13.2275C30.3409 13.1397 30.6483 13.221 30.8825 13.4716C31.1133 13.707 31.2304 14.0408 31.234 14.4729L30.4852 47.696C30.4455 48.4268 30.0526 48.8783 29.3066 49.0505L27.9592 49.3616C27.5786 49.4495 27.2729 49.3757 27.0422 49.1403C26.8079 48.8897 26.6908 48.556 26.6908 48.139L27.0722 32.0791L15.9279 34.652L15.55 51.1441C15.5254 51.8714 15.1402 52.3211 14.3942 52.4933L13.0468 52.8044C12.6662 52.8923 12.3605 52.8185 12.1298 52.5831C11.8803 52.3361 11.7631 52.0023 11.7783 51.5819L12.5218 18.336Z"
          fill={fill}
        ></path>
        <path
          d="M27.064 32.4258C27.0886 31.6985 27.4738 31.2487 28.2198 31.0765L29.59 30.7602C29.9554 30.6758 30.2553 30.7589 30.4895 31.0095C30.7355 31.2414 30.8602 31.5734 30.8638 32.0056L30.526 45.3373L41.6703 42.7644L41.9765 28.983C42.001 28.2557 42.3939 27.8042 43.1551 27.6284L44.5025 27.3174C44.8831 27.2295 45.1905 27.3109 45.4248 27.5615C45.6555 27.7968 45.7727 28.1306 45.7762 28.5628L45.0275 61.7858C44.9877 62.5166 44.5948 62.9681 43.8488 63.1404L42.5015 63.4514C42.1208 63.5393 41.8152 63.4655 41.5844 63.2302C41.3502 62.9796 41.233 62.6458 41.233 62.2289L41.6145 46.169L30.4701 48.7418L30.0922 65.2339C30.0677 65.9612 29.6824 66.4109 28.9364 66.5832L27.589 66.8942C27.2084 66.9821 26.9027 66.9084 26.672 66.673C26.4225 66.4259 26.3054 66.0921 26.3206 65.6717L27.064 32.4258Z"
          fill={fill}
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_2_14"
          x="0.131821"
          y="12.9798"
          width="57.2628"
          height="62.1676"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          ></feColorMatrix>
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2_14"
          ></feBlend>
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2_14"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
};

export default AppLogo;
