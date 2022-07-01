import { Button, Avatar } from "degen";
import Link from "next/link";

type props = {
  href: string;
  src: string;
};

export default function Logo({ href, src }: props) {
  return (
    <Link href={href || "/"} passHref>
      <Button shape="circle" variant="transparent" size="small">
        <Avatar label="logo" src={src} size="9" placeholder={!src} />
      </Button>
    </Link>
  );
}
