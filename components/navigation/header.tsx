import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <>
      <div>
        <ul className="flex sm:space-x-9 flex-col sm:flex-row ">
          <li>
            <Link href="" className="sm:px-4">
              Home
            </Link>
          </li>
          <li>
            <Link href="" className="sm:px-4">
              Projects
            </Link>
          </li>
          <li>
            <Link href="" className="sm:px-4">
              Portfolios
            </Link>
          </li>
          <li>
            <ModeToggle></ModeToggle>
          </li>
        </ul>
      </div>
    </>
  );
}
