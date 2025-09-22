import React, { useRef  } from "react";
import { navLinks } from "../../constants";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { RiNotionFill } from "react-icons/ri";
import FlowingMenu from '../components/AboutSection'

const demoItems = [
  { link: '/dashboard', text: 'Dashboard', image: 'https://picsum.photos/600/400?random=1' },
  { link: '/create-payment', text: 'Create Payment', image: 'https://picsum.photos/600/400?random=2' },
  { link: `${import.meta.env.VITE_BACKEND_URL}/docs`, text: 'Documentation', image: 'https://picsum.photos/600/400?random=3' },
  { link: 'https://github.com/piyushpatelcodes', text: 'About Dev', image: 'https://picsum.photos/600/400?random=4' },
  { link: 'https://piyushpatelcodes.notion.site/274227876587806681e4de4ba96ae232?v=2742278765878060ba16000ccc52ab0e',text: (
      <>
        All Projects: Notion Doc <RiNotionFill className="inline text-5xl items-center" />
      </>
    ), image: 'https://picsum.photos/600/400?random=6' }
];


const LandingPage = () => {
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const bottomTextRef = useRef(null);
  const clipImgRef = useRef(null);


  useGSAP(() => {
    if (!heroRef.current || !navRef.current || !clipImgRef.current) return;

    const heroSplit = new SplitText(heroRef.current, { type: "chars" });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      heroSplit.chars,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.6 }
    );

    tl.fromTo(
      clipImgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.3, ease: "power1.inOut" }
    );

    tl.fromTo(
      navRef.current.querySelectorAll("li"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
      ">+0.1"
    );

    tl.fromTo(
      bottomTextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      "<"
    );

    return () => {
      heroSplit.revert();
    };
  }, []);

  return (
   
<>
    <div className="min-h-screen mt-15 bg-universityBlue font-sans relative overflow-hidden">
      <div className="absolute top-3 left-15 flex justify-end items-center space-x-30 z-1 ">
        <h1
          ref={heroRef}
          id="hero-text"
          className="p-2 text-white relative group xs:text-6xl lg:text-3xl  rounded-sm font-extrabold text-3xl cursor-pointer "
        >
          <a href="/">Edviron.org</a>
          <span className="absolute left-2 bottom-1.5 w-0 h-[5px] bg-blue-600 transition-all duration-300 group-hover:w-40"></span>
        </h1>

        <button className="block lg:hidden p-2 ml-12" aria-label="Open Menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <ul
          ref={navRef}
          className="hidden lg:flex ml-16 gap-12 justify-end text-lg font-sans text-white"
        >
          {navLinks.map((link) => (
            <li key={link.id} className="relative group cursor-pointer">
              <a
                href={`#${link.id}`}
                className="relative inline-block transition-all duration-300 group-hover:-translate-y-2"
              >
                {link.title}
                <span className="absolute left-0 -bottom-1 h-[6px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={clipImgRef}
        id="clip-img"
        className="h-screen group  relative w-[97%] bg-universityPink m-4 clipbg rounded-lg bg-cover bg-no-repeat"
      >
         <div className="absolute inset-0 bg-overlayBlack opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10" />
{/* {images.map((img, idx) => (
        <div
          key={img}
          className={`slideshow-image ${current === idx ? 'visible' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))} */}
  <h1 className="absolute inset-0 flex items-center justify-center text-center text-lime-400 font-extrabold text-[clamp(2rem,4vw,5rem)] opacity-15 group-hover:opacity-100 transition-opacity  duration-500 z-10">
    Higher Education Institute's Payment Gateway
  </h1>
        <div className="absolute bottom-12 right-2  w-full justify-end  flex ">
          <h2 className="text-white bg-blue-900/60 text-sm font-mono p-2  rounded-lg  max-w-xl">
            An Education Society registered under - Government of India's
            Societies Registration Act 1860 (Maha/651/2013/Thane) and a Trust
            registered under Bombay Trusts Act 1950 (AF/27205/Thane){" "}
          </h2>
        </div>
      </div>

      <div
        ref={bottomTextRef}
        className="absolute bottom-4 left-2 w-[100vw]  h-[25vh] md:w-[37%] md:h-[30%] m-4 text-gradient   items-center justify-center"
      >
        <h2 className="text-[clamp(1.5rem,5vw,3.5rem)] leading-tight text-center font-extrabold uppercase w-full">
          Your Mission Starts Here.
        </h2>
        <p className="ml-3 text-[10px]">
          An Education Society registered under -{" "}
          <span class="bottom-text-span">
            Government of India's Societies Registration Act 1860
          </span>{" "}
          (Maha/651/2013/Thane) and a Trust
          <span class="bottom-text-span">
            {" "}
            registered under Bombay Trusts Act 1950
          </span>{" "}
          (AF/27205/Thane).
        </p>
      </div>
    </div>

<div style={{ height: '500px', position: 'relative' }}>
  <FlowingMenu items={demoItems} />
</div>
{/* <About 

/> */}
    </>

  );
};

export default LandingPage;
