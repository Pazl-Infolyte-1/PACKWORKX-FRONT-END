import React from "react";

const Loader = ({ isLoading }) => {
  if (!isLoading) return null; // Hide loader if isLoading is false

  return (
    <div style={styles.overlay}>
      <div style={styles.loader}></div>
    </div>
  );
};

// Styles
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it appears on top
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #4f46e5",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Adding keyframes for animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default Loader;
