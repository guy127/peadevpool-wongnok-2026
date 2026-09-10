import { Button, Link } from "@/components/bases";

const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/recipe">Recipes</Link>
      </div>
      <div>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default Navbar;
