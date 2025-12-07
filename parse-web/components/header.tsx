import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/domains/auth/auth.service";
import { logoutAction } from "@/app/actions/auth";
import Image from "next/image";
import logo from "./logo.png";

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-3xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src={logo} height={36} alt="Parse logo" />
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      @{session.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <form action={logoutAction}>
                      <DropdownMenuItem asChild>
                        <button type="submit" className="w-full cursor-pointer">
                          Sign out
                        </button>
                      </DropdownMenuItem>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/compose">
                  <Button size="sm">New Post</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
