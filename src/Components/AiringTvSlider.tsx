import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAiringTv, IGetTvsResult } from "../api";
import { makeImagePath } from "../utils";

const SliderWrapper = styled.div`
  width: 95vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const SliderTitle = styled.h3`
  font-size: 25px;
`;

const Slider = styled.div`
  width: 95vw;
  margin: 10px auto 0;
  position: relative;
`;

const LeftBtn = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    svg {
      fill: rgba(255, 255, 255, 0.2);
    }
  }
`;

const RightBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    svg {
      fill: rgba(255, 255, 255, 0.2);
    }
  }
`;

const LeftIcon = styled.svg`
  fill: rgba(0, 0, 0, 0.2);
`;

const RightIcon = styled.svg`
  fill: rgba(0, 0, 0, 0.2);
`;

const Row = styled(motion.div)`
  width: 100%;
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 10;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 30px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: ({ isLeft }: { isLeft: boolean }) => ({
    x: isLeft ? window.outerWidth + 5 : -(window.outerWidth + 5),
  }),
  visible: {
    x: 0,
  },
  exit: ({ isLeft }: { isLeft: boolean }) => ({
    x: isLeft ? -(window.outerWidth + 5) : window.outerWidth + 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      duration: 0.3,
      type: "tween",
      delay: 0.5,
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "tween",
      delay: 0.5,
    },
  },
};

const offset = 6;

const AiringTvSlider = () => {
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId/air");

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isLeft, setIsLeft] = useState(true);

  const { scrollY } = useScroll();

  const { data: airingTvData, isLoading } = useQuery<IGetTvsResult>(
    ["airTv", "air"],
    getAiringTv
  );

  const increaseIndex = () => {
    if (airingTvData) {
      if (leaving) return;
      toggleLeaving();
      setIsLeft(false);
      const totalMovies = airingTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (airingTvData) {
      if (leaving) return;
      toggleLeaving();
      setIsLeft(true);
      const totalMovies = airingTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}/air`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    airingTvData?.results.find(
      (movie) => movie.id + "" === bigTvMatch.params.tvId
    );
  return (
    <>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <SliderWrapper>
            <SliderTitle>곧 방영할 프로그램</SliderTitle>
            <Slider>
              <LeftBtn onClick={decreaseIndex}>
                <LeftIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                </LeftIcon>
              </LeftBtn>
              <RightBtn onClick={increaseIndex}>
                <RightIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                </RightIcon>
              </RightBtn>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={{ isLeft: isLeft }}
              >
                <Row
                  variants={rowVariants}
                  custom={{ isLeft: isLeft }}
                  key={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                >
                  {airingTvData?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((tv) => (
                      <Box
                        key={`airing${tv.id}`}
                        layoutId={`${tv.id}airing`}
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => onBoxClicked(tv.id)}
                        bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </SliderWrapper>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={`${bigTvMatch.params.tvId}airing`}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black, transparent),url(
                            ${makeImagePath(clickedTv.backdrop_path, "w500")}`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default AiringTvSlider;
