import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import MovieSlider from "../Components/MovieSlider";
import PopularMovieSlider from "../Components/PopularMovieSlider";
import TopMovieSlider from "../Components/TopRatedMovieSlider";
import UpMovieSlider from "../Components/UpcomingMovieSlider";
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
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -100px;
  gap: 300px;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <PopularMovieSlider />
            <MovieSlider />
            <TopMovieSlider />
            <UpMovieSlider />
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
