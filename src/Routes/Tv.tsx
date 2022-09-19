import { useQuery } from "react-query";
import styled from "styled-components";
import { getAiringTv, IGetTvsResult } from "../api";
import AiringTvSlider from "../Components/AiringTvSlider";
import OnAirTvSlider from "../Components/OnAirTvSlider";
import PopularTvSlider from "../Components/PopularTvSlider";
import TopTvSlider from "../Components/TopRatedTvSlider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  height: 250vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 40%;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  word-break: keep-all;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -100px;
  gap: 300px;
`;

function Tv() {
  const { data, isLoading } = useQuery<IGetTvsResult>(
    ["tv", "nowAiring"],
    getAiringTv
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <PopularTvSlider />
            <OnAirTvSlider />
            <TopTvSlider />
            <AiringTvSlider />
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
