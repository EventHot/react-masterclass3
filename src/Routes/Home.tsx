import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, getLastMovies, IGetMoviesResult, IMovie, getTopRatedMovies, getUpcomingMovies } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
    background: black;
    overflow: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px; ;
`;

const Overview = styled.p`
    font-size: 30px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
    height: 300px;
`;

const SliderTitle = styled.div`
    font-size: 40px;
`;

const Clear = styled.div`
    clear: both;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
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
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
    position: relative;
`;

const AdultMark = styled.span`
    position: absolute;
    right: 0;
    top: 0;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 30px;
    position: relative;
    top: -80px;
    width: 600px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;

    color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween",
        },
    },
};

const offset = 6;

function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/react-masterclass3/movies/:movieId");
    const { scrollY } = useViewportScroll();
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const { data: topData, isLoading: isTopLoading } = useQuery<IGetMoviesResult>(["movies", "top"], getTopRatedMovies);
    const { data: upcomingData, isLoading: isUpcomingLoading } = useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);
    const { data: lastData, isLoading: isLastLoading } = useQuery<IMovie>(["movies", "last"], getLastMovies);
    const [index, setIndex] = useState(0);
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [leaving1, setLeaving1] = useState(false);
    const [leaving2, setLeaving2] = useState(false);
    const increaseIndex = () => {
        if (data) {
            // if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex1 = () => {
        if (topData) {
            // if (leaving1) return;
            toggleLeaving1();
            const totalMovies = topData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex2 = () => {
        if (upcomingData) {
            // if (leaving2) return;
            toggleLeaving2();
            const totalMovies = upcomingData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decreaseIndex = () => {
        if (data) {
            // if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
        }
    };
    const decreaseIndex1 = () => {
        if (topData) {
            // if (leaving1) return;
            toggleLeaving1();
            const totalMovies = topData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev - 1));
        }
    };
    const decreaseIndex2 = () => {
        if (upcomingData) {
            // if (leaving2) return;
            toggleLeaving2();
            const totalMovies = upcomingData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex2((prev) => (prev === maxIndex ? 0 : prev - 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const toggleLeaving1 = () => setLeaving1((prev) => !prev);
    const toggleLeaving2 = () => setLeaving2((prev) => !prev);
    const onBoxClicked = (movieId?: number) => {
        history.push(`/react-masterclass3/movies/${movieId}`);
    };
    const onOverlayClick = () => history.push("/react-masterclass3/");
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        (data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
            topData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
            upcomingData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
            lastData);

    return (
        <Wrapper>
            {isLoading && isLastLoading && isTopLoading && isUpcomingLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "end", top: "60px", zIndex: 100, position: "relative" }}>
                        {/* <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-left-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={decreaseIndex}
                            />
                        </div> */}
                        <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", marginRight: "20px" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-right-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={increaseIndex}
                            />
                        </div>
                    </div>

                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <SliderTitle>Now Playing</SliderTitle>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                                {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + "111"}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            onClick={() => onBoxClicked(movie.id)}
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    <Clear></Clear>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "end", top: "60px", zIndex: 100, position: "relative" }}>
                        {/* <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-left-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={decreaseIndex1}
                            />
                        </div> */}
                        <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", marginRight: "20px" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-right-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={increaseIndex1}
                            />
                        </div>
                    </div>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <SliderTitle>Top Rated Movies</SliderTitle>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index1}>
                                {topData?.results
                                    .slice(1)
                                    .slice(offset * index1, offset * index1 + offset)
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + "222"}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            onClick={() => onBoxClicked(movie.id)}
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <Clear></Clear>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "end", top: "60px", zIndex: 100, position: "relative" }}>
                        {/* <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-left-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={decreaseIndex2}
                            />
                        </div> */}
                        <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", marginRight: "20px" }}>
                            <img
                                style={{ width: "40px", height: "40px" }}
                                src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-right-arrow-essential-phatplus-lineal-color-phatplus.png"
                                alt="adult_true"
                                onClick={increaseIndex2}
                            />
                        </div>
                    </div>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <SliderTitle>Upcoming Movies</SliderTitle>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index2}>
                                {upcomingData?.results
                                    .slice(1)
                                    .slice(offset * index2, offset * index2 + offset)
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + "333"}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            onClick={() => onBoxClicked(movie.id)}
                                            transition={{ type: "tween" }}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <Clear></Clear>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <SliderTitle>Latest Movie</SliderTitle>
                            <Row initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                                <Box
                                    layoutId={lastData?.id + "444"}
                                    key={lastData?.id}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    onClick={() => onBoxClicked(lastData?.id)}
                                    transition={{ type: "tween" }}
                                    bgPhoto={makeImagePath(lastData?.poster_path, "w500")}
                                >
                                    <Info variants={infoVariants}>
                                        <h4>{lastData?.title}</h4>
                                    </Info>
                                </Box>
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay onClick={onOverlayClick} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
                                <BigMovie style={{ top: scrollY.get() + 100 }} layoutId={bigMovieMatch.params.movieId}>
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie.backdrop_path || clickedMovie.poster_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <div
                                                style={{ display: "flex", alignItems: "center", justifyContent: "end", paddingBottom: "30px", marginTop: "-140px", zIndex: 100, position: "relative" }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img
                                                        style={{ width: "40px", height: "40px" }}
                                                        src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-left-arrow-essential-phatplus-lineal-color-phatplus.png"
                                                        alt="adult_true"
                                                    />
                                                    <span style={{ fontSize: "30px" }}>{clickedMovie.vote_count}</span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", marginRight: "20px" }}>
                                                    <img
                                                        style={{ width: "40px", height: "40px" }}
                                                        src="https://img.icons8.com/external-phatplus-lineal-color-phatplus/344/external-right-arrow-essential-phatplus-lineal-color-phatplus.png"
                                                        alt="adult_true"
                                                    />
                                                    <span style={{ fontSize: "30px" }}>{clickedMovie.vote_average}</span>
                                                </div>
                                            </div>
                                            <AdultMark>
                                                {!clickedMovie.adult ? (
                                                    <img style={{ width: "80px", height: "80px" }} src="https://img.icons8.com/stickers/344/18-plus.png" alt="adult_true" />
                                                ) : (
                                                    <img style={{ width: "80px", height: "80px" }} src="https://img.icons8.com/color/344/child-safe-zone--v1.png" alt="adult_false" />
                                                )}
                                            </AdultMark>

                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}
export default Home;
