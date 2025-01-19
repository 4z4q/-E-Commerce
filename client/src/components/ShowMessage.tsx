 
interface ShowMessageProps  {
  message: string
}

const ShowMessage = ({ message }: ShowMessageProps) => {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{message}</p>
    </div>
  );
};

export default ShowMessage;
