import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";
import SecondaryBanner from "../components/SecondaryBanner";

const Home = () => {
    return (
        <div className="mt-5">
            <MainBanner />
            <Categories />
            <BestSeller />
            <SecondaryBanner />
            <NewsLetter />
        </div>
    );
};

export default Home;