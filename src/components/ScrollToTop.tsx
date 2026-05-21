import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // À chaque changement de page, scroll en haut
    }, [pathname]);

    return null; // Ne rend rien à l'écran
};

export default ScrollToTop;
