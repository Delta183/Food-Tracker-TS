import SearchBarComponent from "./SearchBarComponent";

// The IProps again being what is sent over by the parent components
// These will be sent further down to the child component of SearchBarComponent
interface IProps {
  input: string;
  onChange: (text: string) => void;
}

const SearchContainerComponent = ({ input, onChange }: IProps) => {
  return (
    <div className={"search-container"}>
      <div className={"search-title-label"}>
        Nominate your top 5 movies for the upcoming Shoppies Award Show!
      </div>
      <div className={"search-title-label"}>
        Use the searchbar below to find a movie to nominate:{" "}
      </div>
      <SearchBarComponent input={input} onChange={onChange} />
    </div>
  );
};

export default SearchContainerComponent;
