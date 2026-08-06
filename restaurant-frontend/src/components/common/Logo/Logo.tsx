import "./Logo.scss";

type LogoProps = {
  className?: string;
};

function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`logo ${className}`}>
      <span className="logo__outer" />
      <span className="logo__middle" />
      <span className="logo__center" />
    </div>
  );
}

export default Logo;