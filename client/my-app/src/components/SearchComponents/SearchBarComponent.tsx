interface IProps {
  input: string; // Tracking the input in a string
  onChange: (text: string) => void; // Tracking the changes of the text in this function
}

// Consistent with all sub components of the like, be sure to include the IProps within the header
const SearchBarComponent = ({ input, onChange }: IProps) => {
  return (
    <input
      className={"search-bar"}
      value={input} // Be sure that this matches the value in the IProps
      placeholder={"e.g. Pizza, Chicken"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBarComponent;
