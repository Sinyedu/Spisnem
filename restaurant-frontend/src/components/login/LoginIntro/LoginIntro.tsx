import { useEffect, useState } from "react";
import Logo from "../../common/Logo/Logo";

import "./LoginIntro.scss";


interface LoginIntroProps {
  children: React.ReactNode;
}


function LoginIntro({ children }: LoginIntroProps) {

  const [finished, setFinished] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setFinished(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {!finished && (
        <div className="login-intro">
          <div className="login-intro__logo">
            <Logo className="logo--scanning"/>
          </div>
        </div>
      )}


      <div
        className={
          finished
            ? "login-content login-content--visible"
            : "login-content"
        }
      >
        {children}
      </div>
    </>
  );
}

export default LoginIntro;