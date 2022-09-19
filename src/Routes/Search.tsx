import styled from "styled-components";
import SearchMovieSlider from "../Components/SearchMovieSlider";
import SearchTvSlider from "../Components/SearchTvSlider";

const Wrapper = styled.div`
  background-color: black;
  height: 250vh;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 200px;
  gap: 300px;
`;

function Search() {
  return (
    <Wrapper>
      <>
        <SliderWrapper>
          <SearchMovieSlider />
          <SearchTvSlider />
        </SliderWrapper>
      </>
    </Wrapper>
  );
}
export default Search;
