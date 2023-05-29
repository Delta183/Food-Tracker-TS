interface IProps {
  input: string;
  onChange: (text: string) => void;
}

const SearchBarComponent = ({ input, onChange }: IProps) => {
  return (
    <input
      className={"search-bar"}
      value={input}
      placeholder={"e.g. Pizza, Chicken"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBarComponent;
