import { useEffect, useState } from "react";
// import { RotatingLines } from 'react-loader-spinner';
import { useTranslation } from "react-i18next";

/**
 * A reusable loader component that shows a loading overlay
 * @param {Object} props Component props
 * @param {boolean} props.isLoading Whether the loader should be displayed
 * @param {string} props.loaderText Text to display in the loader
 * @param {function} props.t Translation function (optional, defaults to identity function)
 * @returns {JSX.Element|null} The loader component or null if not loading
 */
const Loader = ({ isLoading = false }) => {
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation("deposit");
    // Check screen width on mount and when window is resized
    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 800);
        };

        // Initial check
        checkScreenWidth();

        // Add event listener for resize
        window.addEventListener("resize", checkScreenWidth);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-30 flex items-center justify-center">
            <div
                className={`
        bg-white rounded-3xl shadow-lg flex flex-row items-center justify-center
        ${isMobile ? "w-[95%] px-[30px]" : "w-[670px] px-[60px]"}
        h-[150px]
      `}
            >
                {/* <RotatingLines
          strokeColor="#3956FE"
          strokeWidth="5"
          animationDuration="0.75"
          width="70"
          visible={true}
        /> */}
                <div className="text-[#3956FE] text-[22px] font-bold text-center ml-[20px]">
                    {t("loader_base")}
                </div>
            </div>
        </div>
    );
};

export default Loader;
