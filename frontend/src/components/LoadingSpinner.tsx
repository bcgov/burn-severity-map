import React from 'react';

interface LoadingSpinnerProps {
  /**
   * The message to display alongside the spinner.
   * Defaults to "Loading...".
   */
  message?: string;
  /**
   * The size of the spinner in rem (relative to font-size).
   * Defaults to 3rem.
   */
  size?: number;
  /**
   * The color of the spinner.
   * Defaults to 'indigo-500'. Uses Tailwind CSS color classes.
   */
  spinnerColor?: string;
  /**
   * The color of the text.
   * Defaults to 'gray-700'. Uses Tailwind CSS color classes.
   */
  textColor?: string;
}

/**
 * A simple, visually appealing loading spinner component with customizable message and colors.
 * Utilizes Tailwind CSS for styling and animations.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = 3, // Default size in rem
  spinnerColor = 'indigo-500', // Default spinner color
  textColor = 'gray-700', // Default text color
}) => {
  // Define spinner styles dynamically based on props
  const spinnerStyle = {
    width: `${size}rem`,
    height: `${size}rem`,
    borderWidth: `${size / 8}rem`, // Make border width relative to size
    borderTopColor: `var(--tw-border-${spinnerColor})`, // Tailwind color variable
    borderRightColor: `var(--tw-border-${spinnerColor})`,
    borderBottomColor: `var(--tw-border-${spinnerColor})`,
    borderColor: `rgba(var(--tw-border-${spinnerColor}-rgb), 0.2)`, // Faded background border
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-lg"
      style={{ fontFamily: 'Inter, sans-serif' }} // Apply Inter font
    >
      {/* Spinner Animation */}
      <div
        className={`animate-spin rounded-full border-solid border-transparent`}
        style={spinnerStyle}
      ></div>

      {/* Message Text */}
      {message && (
        <p className={`mt-4 text-lg font-medium text-${textColor}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;