import "./AnimatedLogo.css";

export default function AnimatedLogo() {
  return (
    <div className="logo-wrapper">
      <img
        src={`${import.meta.env.BASE_URL}lidmanu_logo_loading.svg`}
        alt="Načítání"
        className="animated-logo"
      />
    </div>
  );
}
