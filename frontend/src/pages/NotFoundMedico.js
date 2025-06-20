import { NavbarMedico } from "../components/NavbarMedico";
import Footer from "../components/Footer";

function NotFound() {
  return (
    <div>
      <NavbarMedico />
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Footer />
    </div>
  );
}

export default NotFound;
