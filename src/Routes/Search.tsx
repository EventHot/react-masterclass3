// import { useLocation } from "react-router";

// function Search() {
//     const location = useLocation();
//     const keyword = new URLSearchParams(location.search).get("keyword");
//     console.log(keyword);
//     return <div style={{ backgroundColor: "black", height: "200vh", marginTop: "65px", fontSize: "60px" }}>검색 결과</div>;
// }
// export default Search;

import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { ITvResult, getTvShows, getAiringTodayTvShows, getLastTvShows, getPopularShows, getTopRatedTvShows, ITv, IMovie, IGetMoviesResult, searchMovies, searchTvShows } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
    background: black;
    overflow: hidden;
    padding-top: 250px;
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

function Search() {
    const location = useLocation();
    // const keyword = new URLSearchParams(location.search).get("keyword") || "";
    // console.log(keyword);
    const history = useHistory();
    const keyword = useRouteMatch<{ keyword: string }>("/react-masterclass3/search/:keyword");
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/react-masterclass3/search/:keyword/:movieId");
    const { scrollY } = useViewportScroll();
    const { data: searchMovieData, isLoading: isSearchMovieLoading } = useQuery<IGetMoviesResult>(["movie", keyword], () => searchMovies(keyword?.params.keyword));
    const { data: searchTvShowsData, isLoading: isSearchTvLoading } = useQuery<ITvResult>(["tv", keyword], () => searchTvShows(keyword?.params.keyword));
    const [index, setIndex] = useState(0);
    const [index1, setIndex1] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const increaseIndex = () => {
        if (searchMovieData) {
            // if (leaving) return;

            const totalMovies = searchMovieData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const increaseIndex1 = () => {
        if (searchTvShowsData) {
            // if (leaving1) return;

            const totalMovies = searchTvShowsData.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (keyword?: string, movieId?: number) => {
        history.push(`/react-masterclass3/search/${keyword}/${movieId}`);
    };
    const onOverlayClick = () => history.goBack();

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        ((searchMovieData?.results && searchMovieData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId)) ||
            (searchTvShowsData?.results && searchTvShowsData?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId)));

    return (
        <Wrapper>
            {isSearchMovieLoading && isSearchTvLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
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
                            <SliderTitle>Search Result Movies</SliderTitle>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index}>
                                {searchMovieData?.results &&
                                    searchMovieData?.results
                                        .slice(1)
                                        .slice(offset * index, offset * index + offset)
                                        .map((movie) => (
                                            <Box
                                                layoutId={movie.id + "1"}
                                                key={movie.id + "6"}
                                                whileHover="hover"
                                                initial="normal"
                                                variants={boxVariants}
                                                onClick={() => onBoxClicked(keyword?.params.keyword, movie.id)}
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
                                onClick={increaseIndex1}
                            />
                        </div>
                    </div>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <SliderTitle>Search Result TvShows</SliderTitle>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{ type: "tween", duration: 1 }} key={index1}>
                                {searchTvShowsData?.results &&
                                    searchTvShowsData?.results
                                        .slice(1)
                                        .slice(offset * index1, offset * index1 + offset)
                                        .map((movie) => (
                                            <Box
                                                layoutId={movie.id + "9"}
                                                key={movie.id + "4"}
                                                whileHover="hover"
                                                initial="normal"
                                                variants={boxVariants}
                                                onClick={() => onBoxClicked(keyword?.params.keyword, movie.id)}
                                                transition={{ type: "tween" }}
                                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                            >
                                                <Info variants={infoVariants}>
                                                    <h4>{movie.name}</h4>
                                                </Info>
                                            </Box>
                                        ))}
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
                                            <BigTitle>{clickedMovie.title || clickedMovie.name} </BigTitle>
                                            <div
                                                style={{ display: "flex", alignItems: "center", justifyContent: "end", paddingBottom: "30px", marginTop: "-140px", zIndex: 100, position: "relative" }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img
                                                        style={{ width: "40px", height: "40px" }}
                                                        src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/2x/external-like-gamification-flaticons-lineal-color-flat-icons.png"
                                                        alt="adult_true"
                                                    />
                                                    <span style={{ fontSize: "30px" }}>{clickedMovie.vote_count}</span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", marginRight: "20px" }}>
                                                    <img
                                                        style={{ width: "40px", height: "40px" }}
                                                        src="https://img.icons8.com/external-prettycons-flat-prettycons/2x/external-percentage-shopping-prettycons-flat-prettycons.png"
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
export default Search;
