
interface StatusMessageProps {
  message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null;

  const isError = message.includes("Error") || message.includes("Failed");

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "0.75rem",
        backgroundColor: isError ? "#ffe6e6" : "#e6ffe6",
        color: isError ? "#d00" : "#080",
        border: `1px solid ${isError ? "#ffcccc" : "#ccffcc"}`,
        borderRadius: "4px",
        fontSize: "0.9rem",
      }}
    >
      {message}
    </div>
  );
}
